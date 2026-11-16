import {AppState, Linking} from 'react-native';

// Wraps Linking.openSettings() so callers can keep a mutation pending until
// the app returns to the foreground — prevents the passcode screen from
// triggering while the user is in Android Settings (see AuthContext.tsx).
export function openSettingsAndWait(): Promise<void> {
  return new Promise(resolve => {
    Linking.openSettings();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        sub.remove();
        resolve();
      }
    });
  });
}
