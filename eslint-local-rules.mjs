// @ts-no-check

/**
 * Custom ESLint rule to enforce @intl priority comments above defineMessages
 */
const intlPriorityRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Enforce @intl priority comments above defineMessages with valid values',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      invalidIntlValue:
        'Invalid @intl priority value. Must be one of: priority:core, priority:primary, or priority:secondary',
      intlCommentWithoutDefineMessages:
        '@intl priority comment can only be used above defineMessages calls',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    const validPriorities = [
      'priority:core',
      'priority:primary',
      'priority:secondary',
    ];

    return {
      VariableDeclarator(node) {
        // Check if this is a variable declaration with defineMessages as init
        if (
          node.init &&
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === 'defineMessages'
        ) {
          // Get the parent VariableDeclaration node to check for comments
          const varDeclaration = node.parent;

          // Get all comments before the variable declaration
          const comments = sourceCode.getCommentsBefore(varDeclaration);

          // Find the last comment (should be directly before)
          const lastComment = comments[comments.length - 1];

          if (!lastComment) {
            // No comment is fine - we only validate if a comment exists
            return;
          }

          // Check if comment is on the line immediately before
          const commentLine = lastComment.loc.end.line;
          const declarationLine = varDeclaration.loc.start.line;

          if (declarationLine - commentLine > 1) {
            // Comment is too far away, don't validate
            return;
          }

          // Check if it's a line comment with @intl
          const commentText = lastComment.value.trim();
          const intlMatch = commentText.match(/^@intl\s+(.+)$/);

          if (!intlMatch) {
            // Not an @intl comment, ignore
            return;
          }

          // Validate the priority value
          const priorityValue = intlMatch[1].trim();
          if (!validPriorities.includes(priorityValue)) {
            context.report({
              node: lastComment,
              messageId: 'invalidIntlValue',
            });
          }
        }
      },
      CallExpression(node) {
        // Check for standalone defineMessages calls (not in variable declarations)
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'defineMessages' &&
          (!node.parent || node.parent.type !== 'VariableDeclarator')
        ) {
          // Get all comments before the node
          const comments = sourceCode.getCommentsBefore(node);

          // Find the last comment (should be directly before)
          const lastComment = comments[comments.length - 1];

          if (!lastComment) {
            // No comment is fine - we only validate if a comment exists
            return;
          }

          // Check if comment is on the line immediately before
          const commentLine = lastComment.loc.end.line;
          const nodeLine = node.loc.start.line;

          if (nodeLine - commentLine > 1) {
            // Comment is too far away, don't validate
            return;
          }

          // Check if it's a line comment with @intl
          const commentText = lastComment.value.trim();
          const intlMatch = commentText.match(/^@intl\s+(.+)$/);

          if (!intlMatch) {
            // Not an @intl comment, ignore
            return;
          }

          // Validate the priority value
          const priorityValue = intlMatch[1].trim();
          if (!validPriorities.includes(priorityValue)) {
            context.report({
              node: lastComment,
              messageId: 'invalidIntlValue',
            });
          }
        }
      },
      // Check for @intl comments that aren't above defineMessages
      Program() {
        const comments = sourceCode.getAllComments();

        comments.forEach(comment => {
          const commentText = comment.value.trim();
          if (commentText.match(/^@intl\s+/)) {
            // Find the next meaningful token after this comment
            const nextToken = sourceCode.getTokenAfter(comment, {
              includeComments: false,
            });

            // Check if the next code is a defineMessages call
            // We need to check if there's a variable declaration or direct call
            let isBeforeDefineMessages = false;

            if (nextToken) {
              // Get the node at this location
              const tokensAfter = sourceCode.getTokensAfter(comment, {
                count: 10,
                includeComments: false,
              });

              // Look for 'defineMessages' in the next few tokens
              isBeforeDefineMessages = tokensAfter.some(
                token =>
                  token.type === 'Identifier' &&
                  token.value === 'defineMessages',
              );
            }

            if (!isBeforeDefineMessages) {
              context.report({
                node: comment,
                messageId: 'intlCommentWithoutDefineMessages',
              });
            }
          }
        });
      },
    };
  },
};

export default {
  rules: {
    'intl-priority-comment': intlPriorityRule,
  },
};
