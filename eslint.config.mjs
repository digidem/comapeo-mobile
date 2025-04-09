// @ts-check

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pluginReact from '@eslint-react/eslint-plugin';
import {fixupPluginRules, includeIgnoreFile} from '@eslint/compat';
import pluginJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import * as tsParser from '@typescript-eslint/parser';
import pluginJest from 'eslint-plugin-jest';
import pluginReactNative from 'eslint-plugin-react-native';
import * as pluginReactHooks from 'eslint-plugin-react-hooks';
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
      pluginReactHooks.configs['recommended-latest'],
      // https://github.com/facebook/react-native/issues/42996#issuecomment-2275994981
      {
        name: 'eslint-plugin-react-native',
        plugins: {
          'react-native': fixupPluginRules({
            // @ts-expect-error Incorrect typing from dep
            rules: pluginReactNative.rules,
          }),
        },
        rules: pluginReactNative.configs.all.rules,
      },
    ],
    rules: {
      // More noise than signal
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
      // Some React Native libraries use the subscription return approach
      '@eslint-react/web-api/no-leaked-event-listener': 'off',
      // Not relevant for React Native
      '@eslint-react/web-api/no-leaked-resize-observer': 'off',
      // There are some cases in app code when it's needed
      '@typescript-eslint/no-require-imports': 'off',
      // We want to strictly adhere
      'react-hooks/exhaustive-deps': 'error',
      // We want to strictly adhere
      'react-hooks/rules-of-hooks': 'error',
      // Doesn't work well with custom components that wrap Text component
      'react-native/no-raw-text': 'off',
      // We only work on Android for now
      'react-native/split-platform-components': 'off',
      // Relatively harmless
      'react-native/no-color-literals': 'off',
      // Relatively harmless
      'react-native/no-inline-styles': 'off',
      // Relatively harmless
      'react-native/sort-styles': 'off',
    },
    languageOptions: {
      parser: tsParser,
    },
  },
  {
    ...pluginJest.configs['flat/recommended'],
    name: 'eslint-plugin-jest',
    files: ['src/frontend/**/*.test.{js,jsx,mts,ts,tsx}'],
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
