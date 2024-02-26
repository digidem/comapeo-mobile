const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // For https://github.com/kristerkari/react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // For nodejs-mobile
    blockList: [/nodejs-assets\/.*/],
    // For https://github.com/kristerkari/react-native-svg-transformer
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
