import {useMutation} from '@tanstack/react-query';
import * as Location from 'expo-location';

// 'background' key prefix prevents passcode prompt during permission dialog (see AuthContext.tsx)
const LOCATION_PERMISSION_MUTATION_KEY = [
  'background',
  'location',
  'permission',
] as const;

export const LOCATION_PERMISSION_QUERY_KEY = [
  'permission',
  'location',
] as const;

export function useLocationPermissionMutation<T>(fn: () => Promise<T>) {
  return useMutation({
    mutationKey: LOCATION_PERMISSION_MUTATION_KEY,
    mutationFn: fn,
    networkMode: 'always',
  });
}

export type LocationPermission = {granted: boolean; canAskAgain: boolean};

// These functions are here so MapScreen's tests can mock this file rather than mocking
// expo-location itself, which much of that screen's included components also use.
export async function readLocationPermission(): Promise<LocationPermission> {
  const {granted, canAskAgain} = await Location.getForegroundPermissionsAsync();
  return {granted, canAskAgain};
}

// Returns nothing on purpose. What the request resolves with can disagree with
// what a later read reports, so the query stays the only source of truth and
// callers invalidate it instead of storing this.
export async function requestLocationPermission(): Promise<void> {
  await Location.requestForegroundPermissionsAsync();
}
