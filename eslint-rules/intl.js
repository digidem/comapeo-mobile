// @ts-nocheck
/**
 * ESLint rules for react-intl message descriptors.
 *
 * no-unused-message-descriptors: error when a key defined in defineMessages()
 *   is never referenced as m.<key> in the same file.
 *
 * no-duplicate-message-descriptor-ids: error when two descriptors in the same
 *   file share the same `id` string.
 */

const noUnusedMessageDescriptors = {
  meta: {
    type: 'problem',
    messages: {
      unused:
        "Message descriptor '{{key}}' is defined but never used in this file.",
    },
  },
  create(context) {
    const defined = new Map();
    const used = new Set();
    let descriptorVar = null;
    // If m is exported, usages live in other files — skip the unused check
    let descriptorVarIsExported = false;

    return {
      // Detect: const m = defineMessages({ ... })
      // Also detect: export const m = defineMessages({ ... })
      VariableDeclarator(node) {
        if (
          node.init?.type !== 'CallExpression' ||
          node.init.callee.type !== 'Identifier' ||
          node.init.callee.name !== 'defineMessages' ||
          node.id.type !== 'Identifier'
        ) {
          return;
        }
        descriptorVar = node.id.name;
        // Check if the parent VariableDeclaration is directly exported
        const varDecl = node.parent;
        const exportDecl = varDecl?.parent;
        if (
          exportDecl?.type === 'ExportNamedDeclaration' ||
          exportDecl?.type === 'ExportDefaultDeclaration'
        ) {
          descriptorVarIsExported = true;
        }
        const arg = node.init.arguments[0];
        if (arg?.type !== 'ObjectExpression') return;
        for (const prop of arg.properties) {
          if (prop.type === 'Property' && prop.key.type === 'Identifier') {
            defined.set(prop.key.name, prop);
          }
        }
      },

      // Detect: m.someKey or m['someKey'] or m[variable]
      MemberExpression(node) {
        if (
          descriptorVar === null ||
          node.object.type !== 'Identifier' ||
          node.object.name !== descriptorVar
        ) {
          return;
        }
        if (!node.computed) {
          // m.someKey — dot notation
          if (node.property.type === 'Identifier') {
            used.add(node.property.name);
          }
        } else if (node.property.type === 'Literal') {
          // m['someKey'] — string literal bracket notation
          if (typeof node.property.value === 'string') {
            used.add(node.property.value);
          }
        } else {
          // m[variable] — dynamic key, can't statically know which keys are used
          // Mark all defined keys as used to avoid false positives
          for (const key of defined.keys()) {
            used.add(key);
          }
        }
      },

      'Program:exit'() {
        if (descriptorVarIsExported) return;
        for (const [key, node] of defined) {
          if (!used.has(key)) {
            context.report({node, messageId: 'unused', data: {key}});
          }
        }
      },
    };
  },
};

const noDuplicateMessageDescriptorIds = {
  meta: {
    type: 'problem',
    messages: {
      duplicate:
        "Message descriptor id '{{id}}' is already defined in this file.",
    },
  },
  create(context) {
    const seenIds = new Map();

    return {
      // Visit every property named `id` inside an ObjectExpression argument of defineMessages
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'defineMessages'
        ) {
          return;
        }
        const arg = node.arguments[0];
        if (arg?.type !== 'ObjectExpression') return;

        for (const descriptor of arg.properties) {
          if (descriptor.type !== 'Property') continue;
          for (const prop of descriptor.value.properties ?? []) {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.key.name === 'id' &&
              prop.value.type === 'Literal' &&
              typeof prop.value.value === 'string'
            ) {
              const id = prop.value.value;
              if (seenIds.has(id)) {
                context.report({
                  node: prop,
                  messageId: 'duplicate',
                  data: {id},
                });
              } else {
                seenIds.set(id, prop);
              }
            }
          }
        }
      },
    };
  },
};

// eslint-disable-next-line no-undef
module.exports = {
  rules: {
    'no-unused-message-descriptors': noUnusedMessageDescriptors,
    'no-duplicate-message-descriptor-ids': noDuplicateMessageDescriptorIds,
  },
};
