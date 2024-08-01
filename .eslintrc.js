module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', '@tanstack/query'],
  rules: {
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'error',
    '@tanstack/query/stable-query-client': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
          },
        ],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-inline-styles': 'off',
      },
    },
  ],
};
