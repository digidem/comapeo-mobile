import {useMutation} from '@tanstack/react-query';
import * as Location from 'expo-location';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const LOCATION_PERMISSION_KEY = [
  'background',
  'location',
  'permission',
] as const;

export function useLocationPermissionMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: LOCATION_PERMISSION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

// These functions are here so MapScreen's tests can mock this file rather than mocking
// expo-location itself, which much of that screen's included components also use.
export type LocationPermission = {granted: boolean; canAskAgain: boolean};

export async function readLocationPermission(): Promise<LocationPermission> {
  const {granted, canAskAgain} = await Location.getForegroundPermissionsAsync();
  return {granted, canAskAgain};
}

export async function requestLocationPermission(): Promise<LocationPermission> {
  const {granted, canAskAgain} =
    await Location.requestForegroundPermissionsAsync();
  return {granted, canAskAgain};
}
