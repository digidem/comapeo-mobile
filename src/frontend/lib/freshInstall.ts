import type {MMKV} from 'react-native-mmkv';

import {storage} from '../hooks/persistedState/createPersistedState';

// NOTE: Do not change!
const INSTALL_MARKER_KEY = 'installMarker' as const;

type InstallMarkerStorage = Pick<MMKV, 'contains' | 'set' | 'length'>;

/**
 * iOS keeps Keychain items when an app is deleted, so after a reinstall
 * `expo-secure-store` still has the previous install's data.
 * MMKV lives in the app container and goes with the app, so if there is a missing marker
 * it means it is a new install, except on the first launch of the version after this marker is added,
 * where an existing version has no marker either. An otherwise empty MMKV
 * tells those two apart, because nothing can reach the Keychain before
 * onboarding has persisted something here.
 */
export function detectFreshInstall(mmkv: InstallMarkerStorage): boolean {
  if (mmkv.contains(INSTALL_MARKER_KEY)) return false;

  const isFirstLaunchOfThisInstall = mmkv.length === 0;
  mmkv.set(INSTALL_MARKER_KEY, true);

  return isFirstLaunchOfThisInstall;
}

// Runs once, when this file is first imported, which is before any store exists
// to write to MMKV. Checking any later would find MMKV "non-empty" and read a
// reinstall as an ordinary app update.
export const isFreshInstall = detectFreshInstall(storage);
