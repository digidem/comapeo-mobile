module.exports = function (api) {
  api.cache(true);
  return {
    //https://github.com/babel/babel/discussions/13676#discussioncomment-1183149
    compact: true,
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      'react-native-reanimated/plugin',
    ],
  };
};
