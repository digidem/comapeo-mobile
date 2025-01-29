// @ts-check

/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['@rnmapbox/maps/setup-jest'],
  transformIgnorePatterns: [
    'node_modules/(?!(...|@rnmapbox|(jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
  ],
};

module.exports = config;
