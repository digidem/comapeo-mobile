import {useEffect, useRef} from 'react';
import {
  AppState,
  Linking,
  NativeEventSubscription,
  Permission,
  PermissionsAndroid,
} from 'react-native';

type MapeoPermissions = Extract<
  Permission,
  | 'android.permission.CAMERA'
  | 'android.permission.ACCESS_FINE_LOCATION'
  | 'android.permission.ACCESS_COARSE_LOCATION'
>;

/**
 *
 * Turns on a listener that tracks whether the user has enabled the permission manually in the Android settings. If it has been enabled, the `recheckPermission()` function is called, syncing the react state with Android Permission State. Listener is turned off when the permssion is granted. This Listener does NOT check if the user has taken away the permission, as by default android resets the entire app when any permission is taken away.
 */
export const useResetPermissions = (
  permission: MapeoPermissions,
  recheckPermission: () => unknown,
) => {
  const focusSubscription = useRef<NativeEventSubscription | null>(null);

  useEffect(() => {
    PermissionsAndroid.check(permission).then(result => {
      if (!result && !focusSubscription.current) {
        focusSubscription.current = AppState.addEventListener('focus', () => {
          PermissionsAndroid.check(permission).then(permission => {
            if (permission) {
              unsubscribe();
              recheckPermission();
            }
          });
        });
      }
    });

    function unsubscribe() {
      if (focusSubscription.current) {
        focusSubscription.current.remove();
        focusSubscription.current = null;
      }
    }

    return () => {
      unsubscribe();
    };
  }, [PermissionsAndroid, AppState, permission]);

  function navigateToSettings() {
    Linking.openSettings();
  }

  return {navigateToSettings};
};
