const {
  withMainApplication,
  createRunOncePlugin,
} = require('@expo/config-plugins');

// expo-location's foreground-location service only creates its notification
// channel if one with the same id doesn't already exist yet, and it never
// disables the channel's badge. That causes an unwanted badge/dot on the app
// icon on Android while a track is being recorded.
//
// We work around this by pre-creating that channel ourselves in
// MainApplication.onCreate with showBadge(false), before expo-location ever
// gets a chance to create it. Android ignores createNotificationChannel()
// calls for a channel id that already exists, so whichever side creates it
// first wins.
//
// The channel id must exactly match what expo-location computes:
// `${applicationId}:${taskName}`. See LOCATION_TASK_NAME in
// src/frontend/sharedTypes/location.ts and expo-location's
// android/.../services/LocationTaskService.kt (prepareChannel).
const LOCATION_TASK_NAME = 'background-location-task';

const MARKER = '// comapeo: disable-location-notification-badge';

function withDisableLocationNotificationBadge(config) {
  return withMainApplication(config, config => {
    if (config.modResults.language !== 'kt') {
      console.warn(
        'disableLocationNotificationBadge: expected MainApplication.kt, got ' +
          `${config.modResults.language}. Skipping.`,
      );
      return config;
    }

    config.modResults.contents = patchImports(config.modResults.contents);
    config.modResults.contents = patchOnCreate(config.modResults.contents);
    return config;
  });
}

function patchImports(contents) {
  const imports = [
    'import android.app.NotificationChannel',
    'import android.app.NotificationManager',
    'import android.os.Build',
  ];
  const missing = imports.filter(line => !contents.includes(line));
  if (missing.length === 0) {
    return contents;
  }

  const packageDecl = /^package .*[\r\n]+/m;
  if (packageDecl.test(contents)) {
    return contents.replace(
      packageDecl,
      match => match + missing.map(line => `${line}\n`).join(''),
    );
  }
  return missing.map(line => `${line}\n`).join('') + contents;
}

function patchOnCreate(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }

  const anchor = 'super.onCreate()';
  if (!contents.includes(anchor)) {
    console.warn(
      'disableLocationNotificationBadge: could not find "super.onCreate()" in MainApplication.kt. Skipping.',
    );
    return contents;
  }

  const snippet = `
    ${MARKER}
    // Pre-created here with showBadge disabled so Android never badges the
    // app icon for the "recording a track" notification. Must run before
    // expo-location's foreground location service starts, which only
    // happens once the user starts a track, long after app startup.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "$packageName:${LOCATION_TASK_NAME}"
      val notificationManager = getSystemService(NotificationManager::class.java)
      if (notificationManager.getNotificationChannel(channelId) == null) {
        val channel = NotificationChannel(
          channelId,
          applicationInfo.loadLabel(packageManager).toString(),
          NotificationManager.IMPORTANCE_LOW
        )
        channel.description = "Background location notification channel"
        channel.setShowBadge(false)
        notificationManager.createNotificationChannel(channel)
      }
    }
`;

  return contents.replace(anchor, anchor + snippet);
}

module.exports = createRunOncePlugin(
  withDisableLocationNotificationBadge,
  'with-disable-location-notification-badge',
  '1.0.0',
);
