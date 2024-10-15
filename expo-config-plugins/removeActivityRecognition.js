const {withAndroidManifest} = require('@expo/config-plugins');

/**
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
module.exports = function removeActivityRecognitionPermission(expoConfig) {
  return withAndroidManifest(expoConfig, config => {
    const manifest = config.modResults.manifest;

    if (manifest['uses-permission']) {
      // Check and remove the ACTIVITY_RECOGNITION permission
      const activityRecognitionIndex = manifest['uses-permission'].findIndex(
        permission =>
          permission.$['android:name'] ===
          'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
      );

      if (
        activityRecognitionIndex !== undefined &&
        activityRecognitionIndex !== -1
      ) {
        manifest['uses-permission'].splice(activityRecognitionIndex, 1);
      }
    }

    return config;
  });
};
