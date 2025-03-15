import {
  LocationObject,
  PermissionStatus,
  LocationProviderStatus,
} from 'expo-location';
import {createStore} from 'zustand';

export type LocationState = {
  location: LocationObject | undefined;
  throttledLocation: LocationObject | undefined;
  locationPermission: PermissionStatus;
  providerStatus: LocationProviderStatus | undefined;
};

export function createLocationStore(initialStatus: PermissionStatus) {
  const instance = createStore<LocationState>()(() => {
    return {
      location: undefined,
      throttledLocation: undefined,
      locationPermission: initialStatus,
      providerStatus: undefined,
    };
  });

  return instance;
}
