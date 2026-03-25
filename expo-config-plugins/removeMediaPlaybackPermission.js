const {withAndroidManifest} = require('@expo/config-plugins');

/**
 * Removes the FOREGROUND_SERVICE_MEDIA_PLAYBACK permission injected by
 * expo-audio's AndroidManifest.xml. The app does not play audio in the
 * background, so this permission is not needed.
 */
module.exports = function removeMediaPlaybackPermission(config) {
  return withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;
    const permissions = manifest['uses-permission'] ?? [];
    manifest['uses-permission'] = permissions.filter(
      p =>
        p.$['android:name'] !==
        'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
    );
    return config;
  });
};
