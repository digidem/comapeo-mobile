// @ts-check

import path from 'node:path';
import {fileURLToPath} from 'node:url';
import react from '@eslint-react/eslint-plugin';
import {includeIgnoreFile} from '@eslint/compat';
import js from '@eslint/js';
import pluginQuery from '@tanstack/eslint-plugin-query';
// @ts-expect-error Requires updating tsconfig (see https://github.com/typescript-eslint/typescript-eslint/issues/7284)
import * as tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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

const toolingConfig = tseslint.config({
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

const backendConfig = tseslint.config({
  name: 'backend',
  files: ['src/backend/**/*.{js,ts}'],
  extends: [tseslint.configs.recommended],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.nodeBuiltin,
      ...globals.worker,
    },
  },
});

// TODO: Incorporate react-native
const frontendConfig = tseslint.config({
  name: 'frontend',
  files: ['src/frontend/**/*.{js,jsx,ts,tsx}'],
  extends: [
    tseslint.configs.recommended,
    pluginQuery.configs['flat/recommended'],
    // TODO: incorporate 'disable-dom' and 'disable-web-apis' presets
    react.configs['recommended-typescript'],
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
  },
  languageOptions: {
    parser: tsParser,
  },
});

export default tseslint.config(
  js.configs.recommended,
  toolingConfig,
  backendConfig,
  frontendConfig,
  {ignores: ['e2e/**/*']},
  includeIgnoreFile(gitignorePath),
  includeIgnoreFile(gitExcludePath),
);
