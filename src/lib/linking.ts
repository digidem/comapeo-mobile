import {Platform, Linking} from 'react-native';

export async function openWiFiSettings() {
  if (Platform.OS !== 'android')
    throw new Error(
      'openWiFiSettings() is currently only available on Android',
    );

  // https://github.com/facebook/react-native/blob/v0.73.5/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/modules/intent/IntentModule.java#L204
  // https://developer.android.com/reference/android/provider/Settings#ACTION_WIFI_SETTINGS
  return Linking.sendIntent('android.settings.WIFI_SETTINGS');
}
