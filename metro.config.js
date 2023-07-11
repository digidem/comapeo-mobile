/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    blockList: exclusionList([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
    // Needed because rpc-reflector and tiny-typed-emitter expects some Node built-ins to be present
    extraNodeModules: {
      events: `${__dirname}/node_modules/rollup-plugin-node-polyfills/polyfills/events`,
      process: `${__dirname}/node_modules/rollup-plugin-node-polyfills/polyfills/process-es6`,
      util: `${__dirname}/node_modules/rollup-plugin-node-polyfills/polyfills/util`,
    },
  },
};
