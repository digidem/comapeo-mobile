const {withAndroidManifest} = require('@expo/config-plugins');

/**
 * Removes the FOREGROUND_SERVICE_MEDIA_PLAYBACK permission injected by
 * expo-audio's AndroidManifest.xml. The app does not play audio in the
 * background, so this permission is not needed.
 *
 * Filtering the entries from the prebuild manifest is not enough because
 * expo-audio ships the AudioControlsService in its AAR's own manifest, which
 * Gradle merges in after prebuild. That service declares
 * foregroundServiceType="mediaPlayback", which implicitly requires the
 * permission. Instead, we inject tools:node="remove" directives so the Gradle
 * manifest merger strips both the service and the permission.
 */
module.exports = function removeMediaPlaybackPermission(config) {
  return withAndroidManifest(config, config => {
    const manifest = config.modResults.manifest;

    // Add the tools namespace so tools:node="remove" is valid
    manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Tell the Gradle manifest merger to remove this permission even if a
    // library re-introduces it
    const permissions = manifest['uses-permission'] ?? [];
    manifest['uses-permission'] = permissions.filter(
      p =>
        p.$['android:name'] !==
        'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
    );
    permissions.push({
      $: {
        'android:name': 'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
        'tools:node': 'remove',
      },
    });
    manifest['uses-permission'] = permissions.filter(
      p =>
        p.$['android:name'] !==
          'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK' ||
        p.$['tools:node'] === 'remove',
    );

    // Tell the Gradle manifest merger to remove AudioControlsService even if
    // expo-audio's AAR manifest re-introduces it
    const application = manifest.application?.[0];
    if (application) {
      const services = application.service ?? [];
      application.service = services.filter(
        s =>
          s.$['android:name'] !==
          'expo.modules.audio.service.AudioControlsService',
      );
      application.service.push({
        $: {
          'android:name': 'expo.modules.audio.service.AudioControlsService',
          'tools:node': 'remove',
        },
      });
    }

    return config;
  });
};
