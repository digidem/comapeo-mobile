// sodium-native@4+ uses require-addon to load its native binary, which is
// only available in the nodejs-mobile runtime. Stub it so Jest can load
// @comapeo/core without crashing. The actual crypto is never called in tests.
require.addon = () => ({});
