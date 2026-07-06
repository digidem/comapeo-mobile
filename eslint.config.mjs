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
import pluginTestingLibrary from 'eslint-plugin-testing-library';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import pluginTs from 'typescript-eslint';
import {createRequire} from 'node:module';
const pluginIntl = createRequire(import.meta.url)('./eslint-rules/intl.js');

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
    'expo-config-plugins/**/*.{js,mjs,cjs}',
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
      pluginReactCompiler.configs['recommended'],
      pluginReactHooks.configs.flat['recommended-latest'],
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
    plugins: {
      intl: pluginIntl,
    },
    rules: {
      'intl/no-unused-message-descriptors': 'error',
      'intl/no-duplicate-message-descriptor-ids': 'error',
      // Duplicate of react-hooks/set-state-in-effect, already set to warn below
      '@eslint-react/set-state-in-effect': 'off',
      // Some React Native libraries use the subscription return approach
      '@eslint-react/web-api/no-leaked-event-listener': 'off',
      // Not relevant for React Native
      '@eslint-react/web-api/no-leaked-resize-observer': 'off',
      // Not relevant for React Native (no DOM setTimeout cleanup needed)
      '@eslint-react/web-api-no-leaked-timeout': 'off',
      // useContext is still valid
      '@eslint-react/no-use-context': 'off',
      // Mock functions legitimately use 'use' prefix to match real hook names
      '@eslint-react/no-unnecessary-use-prefix': 'off',
      // new Date() during render is acceptable in React Native (no hydration concerns)
      '@eslint-react/purity': 'off',
      // Naming conventions/ style preference not traditionally used by us
      '@eslint-react/naming-convention-ref-name': 'off',
      // There are some cases in app code when it's needed
      '@typescript-eslint/no-require-imports': 'off',
      // Requires ES2022 error lib for {cause} support — not in our tsconfig base
      'preserve-caught-error': 'off',
      // We want to strictly adhere
      'react-hooks/exhaustive-deps': 'error',
      // We want to strictly adhere
      'react-hooks/rules-of-hooks': 'error',
      // New stricter rules from eslint-plugin-react-hooks@7 — downgraded to warn
      // to avoid blocking existing code patterns during upgrade cycle
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/incompatible-library': 'warn',
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
    name: 'tests',
    files: [
      'src/frontend/**/*.test.{js,jsx,mts,ts,tsx}',
      'src/frontend/**/__mocks__/**',
    ],
    extends: [
      pluginJest.configs['flat/recommended'],
      pluginTestingLibrary.configs['flat/react'],
    ],
    rules: {
      // Mostly conventional and doesn't have significant impact on how tests work
      'testing-library/render-result-naming-convention': 'off',
      '@eslint-react/hooks-extra/no-unnecessary-use-prefix': 'off',
      '@eslint-react/hooks-extra/no-useless-custom-hooks': 'off',
    },
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
