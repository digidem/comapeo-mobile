// @ts-check

const NODE_MODULE_PATTERNS_TO_TRANSFORM = [
  // React Native
  '(?:jest-)?react-native',
  '@react-native',
  '@?expo',
  '@?react-navigation',
  '@sentry/',
  'native-base',
  // Awana modules distributed as ESM
  '@comapeo/',
  '@mapeo/',
  'custom-error-creator',
  'rpc-reflector',
  // Intl modules distributed as ESM
  'react-intl',
  '@formatjs/',
  'intl-messageformat',
  // Helper modules distributed as ESM
  '@sindresorhus/merge-streams',
  'bcp-47',
  'cheap-ruler',
  'comapeocat',
  'compress-commons',
  'crc32-stream',
  'dot-prop',
  'ensure-error',
  'filter-obj',
  'index-to-position',
  'into-stream',
  'is-alphabetical',
  'is-alphanumerical',
  'is-decimal',
  'is-plain-obj',
  'is-stream',
  'iso-3166',
  'ky',
  'map-obj',
  'mbtiles-reader',
  'mime',
  'nanoid',
  'p-defer',
  'p-event',
  'p-limit',
  'p-queue',
  'p-timeout',
  'parse-json',
  'serialize-error',
  'string-timing-safe-equal',
  'styled-map-package',
  'uint8array-extras',
  'un-m49',
  'yocto-queue',
  'zip-stream-promise',
  'zip-stream',
  '@lodev09/react-native-exify',
];

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  resolver: './node_modules/react-native-worklets/jest/resolver.js',
  // https://react-native-documents.github.io/docs/sponsor-only/jest-mocks
  setupFiles: [
    './node_modules/@react-native-documents/picker/jest/build/jest/setup.js',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        extends: './babel.config.js',
        plugins: [
          ['babel-plugin-transform-import-meta', {module: 'ES6'}],
          '@babel/plugin-transform-class-static-block',
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    `/node_modules/(?!${NODE_MODULE_PATTERNS_TO_TRANSFORM.join('|')})`,
    '/node_modules/react-native-reanimated/plugin/',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/frontend/__mocks__/svg.tsx',
    '^@comapeo/core/package\\.json$':
      '<rootDir>/node_modules/@comapeo/core/package.json',
    '^@comapeo/ipc$': '<rootDir>/node_modules/@comapeo/ipc/dist/index.js',
    '^custom-error-creator$':
      '<rootDir>/node_modules/custom-error-creator/index.js',
    '^@comapeo/map-server/constants\\.js$':
      '<rootDir>/node_modules/@comapeo/map-server/dist/lib/constants.js',
    '^comapeocat/reader\\.js$':
      '<rootDir>/node_modules/comapeocat/src/reader.js',
    '^comapeocat/writer\\.js$':
      '<rootDir>/node_modules/comapeocat/src/writer.js',
  },
  // Avoid `jest-haste-map: Haste module naming collision` warnings
  modulePathIgnorePatterns: [
    '<rootDir>/android',
    '<rootDir>/ios',
    '<rootDir>/assets',
  ],
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
};

module.exports = config;
