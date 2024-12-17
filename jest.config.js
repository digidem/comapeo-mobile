// @ts-check

/** @type {import("jest").Config} */
const config = {
  preset: 'jest-expo',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['@rnmapbox/maps/setup-jest'],
  transformIgnorePatterns: [
    'node_modules/(?!(...|@rnmapbox|(jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    // Jest seems to have issues with resolving '@comapeo/core-react' due to being a pure ESM module,
    // but Metro doesn't when running the app
    '^@comapeo/core-react': '<rootDir>/node_modules/@comapeo/core-react/dist',
  },
};

module.exports = config;
