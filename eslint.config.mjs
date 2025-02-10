// @ts-check

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pluginReact from '@eslint-react/eslint-plugin';
import {includeIgnoreFile, fixupPluginRules} from '@eslint/compat';
import pluginJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
// @ts-expect-error Requires updating tsconfig (see https://github.com/typescript-eslint/typescript-eslint/issues/7284)
import * as tsParser from '@typescript-eslint/parser';
import pluginJest from 'eslint-plugin-jest';
import pluginReactNative from 'eslint-plugin-react-native';
import globals from 'globals';
import pluginTs from 'typescript-eslint';

const gitignorePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '.gitignore',
);

const gitExcludePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '.git',
  'info',
  'exclude',
);

const toolingConfig = pluginTs.config({
  name: 'tooling',
  files: [
    '*.config.{js,mjs,cjs}',
    'scripts/*.{js,mjs,cjs}',
    'expo-config-plugins/*.{js,mjs,cjs}',
  ],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.nodeBuiltin,
      ...globals.worker,
    },
  },
});

const backendConfig = pluginTs.config({
  name: 'backend',
  files: ['src/backend/**/*.{js,ts}'],
  extends: [pluginTs.configs.recommended],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.nodeBuiltin,
      ...globals.worker,
    },
  },
});

const frontendConfig = pluginTs.config(
  {
    name: 'frontend',
    files: ['src/frontend/**/*.{js,jsx,ts,tsx}'],
    extends: [
      pluginTs.configs.recommended,
      pluginQuery.configs['flat/recommended'],
      pluginReact.configs['recommended-typescript'],
      pluginReact.configs['disable-dom'],
      // https://github.com/facebook/react-native/issues/42996#issuecomment-2275994981
      {
        name: 'eslint-plugin-react-native',
        plugins: {
          'react-native': fixupPluginRules({
            // @ts-expect-error
            rules: pluginReactNative.rules,
          }),
        },
        rules: {
          ...pluginReactNative.configs.all.rules,
          'react-native/sort-styles': 'off',
          'react-native/no-inline-styles': 'off',
          'react-native/no-color-literals': 'warn',
        },
      },
    ],
    rules: {
      // Allow unused vars if prefixed with `_` (https://typescript-eslint.io/rules/no-unused-vars/)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-require-imports': 'warn',
      '@eslint-react/web-api/no-leaked-resize-observer': 'off',
    },
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ...pluginJest.configs['flat/recommended'],
    name: 'eslint-plugin-jest',
    files: ['src/frontend/**/*.test.{js,jsx,ts,tsx}'],
  },
);

export default pluginTs.config(
  {ignores: ['e2e/**/*']},
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(gitExcludePath),
  pluginJs.configs.recommended,
  toolingConfig,
  backendConfig,
  frontendConfig,
);
