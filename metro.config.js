const {getSentryExpoConfig} = require('@sentry/react-native/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname, {
  annotateReactComponents: true,
});
const defaultBlockList = Array.isArray(config.resolver.blockList)
  ? config.resolver.blockList
  : [config.resolver.blockList];

module.exports = {
  ...config,
  transformer: {
    ...config.transformer,
    // For https://github.com/kristerkari/react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
  },
  resolver: {
    ...config.resolver,
    blockList: [
      ...defaultBlockList,
      // for nodejs-mobile: https://nodejs-mobile.github.io/docs/guide/guide-react-native/getting-started#duplicate-module-name
      /android\/.*/,
      /ios\/.*/,
      /nodejs-assets\/.*/,
    ],
    // For https://github.com/kristerkari/react-native-svg-transformer
    assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
    // Required for importing @comapeo/ipc and rpc-reflector without bundling the server/backend code also
    unstable_enablePackageExports: true,
    // @comapeo/core-react imports DEFAULT_MAP_ID from the @comapeo/map-server root, which pulls in
    // Node.js-only server code. Redirect to the constants subpath which has no Node deps.
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@comapeo/map-server') {
        return context.resolveRequest(
          context,
          '@comapeo/map-server/constants.js',
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};
