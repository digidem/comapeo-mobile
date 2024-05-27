const {
  withAndroidManifest,
  createRunOncePlugin,
} = require('expo/config-plugins');

/**
 * @type {import('./types').ManifestQueries}
 */

const queries = {
  package: [
    {
      $: {
        'android:name': 'com.whatsapp',
      },
    },
    {
      $: {
        'android:name': 'com.google.android.apps.messaging',
      },
    },
  ],
  intent: [
    {
      action: {
        $: {
          'android:name': 'android.intent.action.VIEW',
        },
      },
      category: {
        $: {
          'android:name': 'android.intent.category.BROWSABLE',
        },
      },
    },
  ],
};

/**
 * @param {import('@expo/config-plugins').ExportedConfig} config
 */
const withAndroidManifestService = config => {
  return withAndroidManifest(config, config => {
    config.modResults.manifest = {
      ...config.modResults.manifest,
      //@ts-ignore
      queries,
    };

    return config;
  });
};

module.exports = createRunOncePlugin(
  withAndroidManifestService,
  'withAndroidManifestService',
  '1.0.0',
);
