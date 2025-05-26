import {
  watchPositionAsync,
  Accuracy,
  LocationSubscription,
  getProviderStatusAsync,
  getForegroundPermissionsAsync,
} from 'expo-location';
import React, {createContext, useContext} from 'react';
import {getCoords} from '../hooks/useLocation';
import CheapRuler from 'cheap-ruler';
import {useQueryClient} from '@tanstack/react-query';
import {AppState, AppStateStatus} from 'react-native';
import {useStore} from 'zustand';
import * as Sentry from '@sentry/react-native';

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

export function useLocationState(): LocationState;
export function useLocationState<T>(selector: (state: LocationState) => T): T;
export function useLocationState<T>(selector?: (state: LocationState) => T) {
  const store = useLocationContext();
  return useStore(store, selector!);
}

const LocationContext = createContext<ReturnType<
  typeof createLocationStore
> | null>(null);

const POLL_PROVIDER_STATUS_INTERVAL = 10;

export function LocationProvider({children}: {children: React.ReactNode}) {
  const [store] = React.useState(() => createLocationStore());

  const queryClient = useQueryClient();

  // These useEffects update the store but do not cause re-renders as the store itself is stable
  // zustand's useStore deal with the react state.
  React.useEffect(() => {
    let subscription: LocationSubscription | null = null;
    watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
      },
      location => {
        store.setState(prev => ({...prev, location}));
        const lastThrottledLocation = store.getState().throttledLocation;
        if (!lastThrottledLocation) {
          store.setState(prev => ({
            ...prev,
            throttledLocation: location,
          }));
          return;
        }

        const timeElapsed =
          location.timestamp - lastThrottledLocation.timestamp;

        if (timeElapsed < 1000) return;

        const coords = getCoords(location);
        const lastCoords = getCoords(lastThrottledLocation);
        const ruler = new CheapRuler(lastCoords[1], 'meters');
        const distance = ruler.distance(coords, lastCoords);

        if (distance > 5) {
          store.setState(prev => ({
            ...prev,
            throttledLocation: location,
          }));
          return;
        }
      },
    )
      .then(sub => (subscription = sub))
      .catch(error => {
        console.error('Failed to start location tracking:', error);
      });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [store]);

  React.useEffect(() => {
    let ignore = false;
    async function checkProviderStatus() {
      getProviderStatusAsync()
        .then(status => {
          if (ignore) return;
          if (!status.locationServicesEnabled)
            queryClient.invalidateQueries({queryKey: ['lastLocation']});
          store.setState(store => ({...store, providerStatus: status}));
        })
        // Shouldn't happen because we check permissions.granted above, but just in case
        .catch(err => {
          Sentry.captureException(err);
        });
    }
    checkProviderStatus();
    const intervalId = setInterval(
      checkProviderStatus,
      POLL_PROVIDER_STATUS_INTERVAL,
    );
    return () => {
      clearInterval(intervalId);
      ignore = true;
    };
  }, [store, queryClient]);

  React.useEffect(() => {
    let isCancelled = false;
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const newPermissionStatus = (await getForegroundPermissionsAsync())
          .status;
        if (isCancelled) return;
        const prevPermission = store.getState().locationPermission;
        if (prevPermission !== newPermissionStatus) {
          store.setState(state => ({
            ...state,
            locationPermission: newPermissionStatus,
          }));
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      isCancelled = true;
      subscription.remove();
    };
  }, [store]);

  return (
    <LocationContext.Provider value={store}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === null) {
    throw new Error('Location Context not intialized');
  }
  return context;
}
