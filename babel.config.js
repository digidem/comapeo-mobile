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
            sources: filename => {
              if (filename.includes('src/frontend/sharedComponents/')) {
                return true;
              }
              if (filename.includes('src/frontend/screens/')) {
                return true;
              }
              if (filename.includes('src/frontend/contexts/')) {
                return true;
              }
              if (filename.includes('src/frontend/hooks/')) {
                return true;
              }
              if (filename.includes('src/frontend/utils/')) {
                return true;
              }
              if (filename.includes('src/frontend/animations/')) {
                return true;
              }
              if (filename.includes('src/frontend/types/')) {
                return true;
              }
              if (filename.includes('src/frontend/sharedTypes/')) {
                return true;
              }
              if (filename.includes('src/frontend/lib/')) {
                return true;
              }
              if (filename.includes('src/frontend/Navigation/')) {
                return true;
              }
              if (filename.includes('src/frontend/App.tsx')) {
                return true;
              }
              if (filename.includes('src/frontend/AppNavigator.tsx')) {
                return true;
              }
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
