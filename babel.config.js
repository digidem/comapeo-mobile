const assert = require('node:assert');

const requiredEnvVars = [
  'MAPBOX_ACCESS_TOKEN',
  'COMAPEO_METRICS_URL',
  'COMAPEO_METRICS_API_KEY',
];

for (const requiredEnvVar of requiredEnvVars) {
  assert(
    process.env[requiredEnvVar],
    `Missing required environment variable: ${requiredEnvVar}`,
  );
}

module.exports = function (api) {
  api.cache(true);
  return {
    //https://github.com/babel/babel/discussions/13676#discussioncomment-1183149
    compact: true,
    presets: [
      [
        'babel-preset-expo',
        {
          'react-compiler': {
            // eslint-disable-next-line no-unused-vars
            sources: filename => {
              // Incremental adoption: Start with just one simple component
              // For now, compile nothing until we verify it works
              return false;
            },
          },
        },
      ],
    ],
    plugins: [
      ['transform-inline-environment-variables', {include: requiredEnvVars}],
      // react-native-reanimated/plugin has to be last
      'react-native-reanimated/plugin',
    ],
  };
};
