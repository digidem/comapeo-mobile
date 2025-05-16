import {
  LocationObject,
  PermissionStatus,
  LocationProviderStatus,
} from 'expo-location';
import {createStore} from 'zustand';

export type LocationState = {
  location: LocationObject | undefined;
  throttledLocation: LocationObject | undefined;
  locationPermission: PermissionStatus | undefined;
  providerStatus: LocationProviderStatus | undefined;
};

export function createLocationStore() {
  const instance = createStore<LocationState>()(() => {
    return {
      location: undefined,
      throttledLocation: undefined,
      locationPermission: undefined,
      providerStatus: undefined,
    };
  });

  return instance;
}
