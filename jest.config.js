// @ts-check

const NODE_MODULE_PATTERNS_TO_TRANSFORM = [
  // React Native
  '(?:jest-)?react-native',
  '@react-native',
  '@?expo',
  '@?react-navigation',
  '@sentry/react-native',
  'native-base',
  '@rnmapbox/maps',
  // Awana modules distributed as ESM
  '@comapeo/',
  '@mapeo/',
  'rpc-reflector',
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
];

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // https://react-native-documents.github.io/docs/sponsor-only/jest-mocks
  setupFiles: [
    './node_modules/@react-native-documents/picker/jest/build/jest/setup.js',
  ],
  setupFilesAfterEnv: ['@rnmapbox/maps/setup-jest', './jest.setup.js'],
  transform: {
    '\\.[jt]sx?$': [
      'babel-jest',
      {
        extends: './babel.config.js',
        plugins: [['babel-plugin-transform-import-meta', {module: 'ES6'}]],
      },
    ],
  },
  transformIgnorePatterns: [
    `/node_modules/(?!${NODE_MODULE_PATTERNS_TO_TRANSFORM.join('|')})`,
    '/node_modules/react-native-reanimated/plugin/',
  ],
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/src/frontend/__mocks__/svg.tsx',
    '^@comapeo/ipc$': '<rootDir>/node_modules/@comapeo/ipc/dist/index.js',
    '^comapeocat/reader\\.js$':
      '<rootDir>/node_modules/comapeocat/src/reader.js',
    '^comapeocat/writer\\.js$':
      '<rootDir>/node_modules/comapeocat/src/writer.js',
  },
  // Avoid `jest-haste-map: Haste module naming collision` warnings
  modulePathIgnorePatterns: [
    '<rootDir>/android',
    '<rootDir>/ios',
    '<rootDir>/nodejs-assets',
    '<rootDir>/assets',
  ],
  testPathIgnorePatterns: ['<rootDir>/tests/e2e/'],
};

module.exports = config;
