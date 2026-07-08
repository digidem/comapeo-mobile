// @ts-check

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import pluginReact from '@eslint-react/eslint-plugin';
import {includeIgnoreFile} from '@eslint/config-helpers';
import pluginJs from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
import * as tsParser from '@typescript-eslint/parser';
import pluginJest from 'eslint-plugin-jest';
import pluginTestingLibrary from 'eslint-plugin-testing-library';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import pluginTs from 'typescript-eslint';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const pluginIntl = require('./eslint-rules/intl.js');
const pluginReactNativeCustom = require('./eslint-rules/react-native.js');

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
    ],
    plugins: {
      intl: pluginIntl,
      'react-native': pluginReactNativeCustom,
    },
    rules: {
      'intl/no-unused-message-descriptors': 'error',
      'intl/no-duplicate-message-descriptor-ids': 'error',
      'react-native/no-single-element-style-arrays': 'error',
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
      // In @testing-library/react-native v14, fireEvent (and render/rerender)
      // became async and MUST be awaited — unlike the DOM library the plugin's
      // 'react' preset assumes. Require awaiting fireEvent, and stop forbidding it.
      'testing-library/await-async-events': [
        'error',
        {eventModule: ['fireEvent', 'userEvent']},
      ],
      'testing-library/no-await-sync-events': 'off',
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
