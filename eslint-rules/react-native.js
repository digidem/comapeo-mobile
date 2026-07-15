/**
 * ESLint rules for React Native.
 *
 * no-single-element-style-arrays: error when a style prop is passed a single-element
 *   array, e.g. style={[styles.foo]}. These cause unnecessary re-renders because the
 *   array identity always changes. Use style={styles.foo} instead.
 */

const noSingleElementStyleArrays = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow single element style arrays — they cause unnecessary re-renders as the array identity always changes',
    },
    fixable: 'code',
  },

  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return;
        const value = node.value;
        if (!value || !value.expression) return;
        const expr = value.expression;
        if (expr.type !== 'ArrayExpression') return;
        if (expr.elements.length !== 1) return;

        context.report({
          node,
          message:
            'Single element style arrays are not necessary and cause unnecessary re-renders',
          fix(fixer) {
            const element = expr.elements[0];
            return fixer.replaceText(expr, context.sourceCode.getText(element));
          },
        });
      },
    };
  },
};

// eslint-disable-next-line no-undef
module.exports = {
  rules: {
    'no-single-element-style-arrays': noSingleElementStyleArrays,
  },
};
