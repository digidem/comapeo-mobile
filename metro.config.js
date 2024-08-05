const {getSentryExpoConfig} = require('@sentry/react-native/metro');

const NO_ICU_PARSER_MODULE_PATH = require.resolve(
  '@formatjs/icu-messageformat-parser/no-parser',
);

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);
const defaultBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList];

/** @type {import('expo/metro-config').MetroConfig} */
module.exports = {
  ...config,
  transformer: {
    ...config.transformer,
    // For https://github.com/kristerkari/react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...config.resolver,
    resolveRequest: (context, moduleName, platform) => {
      // https://formatjs.io/docs/guides/advanced-usage#react-intl-without-parser-40-smaller
      if (moduleName.startsWith('@formatjs/icu-messageformat-parser')) {
        return {filePath: NO_ICU_PARSER_MODULE_PATH, type: 'sourceFile'};
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    // For nodejs-mobile
    blockList: [
      ...defaultBlockList,
      /nodejs-assets\/.*/,
      // TODO: Update comapeo-schema to make ajv a dev-dep
      /node_modules\/ajv\/.*/,
    ],
    // For https://github.com/kristerkari/react-native-svg-transformer
    assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
  },
};
