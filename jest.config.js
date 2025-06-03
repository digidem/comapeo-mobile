// @ts-check

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
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
    'node_modules/(?!(...|@rnmapbox|(jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
  ],
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
