const {withAndroidManifest} = require('@expo/config-plugins');

module.exports = function androiManifestPlugin(androiManifestPluginConfig) {
  return withAndroidManifest(
    androiManifestPluginConfig,
    async withAndroidManifestConfig => {
      let androidManifest = withAndroidManifestConfig.modResults.manifest;

      androidManifest['queries'].push({
        intent: [
          {
            action: [
              {
                $: {
                  'android:name': 'android.intent.action.VIEW',
                },
              },
            ],
            data: [
              {
                $: {
                  'android:scheme': 'https',
                  'android:host': '*',
                },
              },
            ],
          },
        ],
      });

      return withAndroidManifestConfig;
    },
  );
};
