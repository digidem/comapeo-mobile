import {
  watchPositionAsync,
  Accuracy,
  LocationSubscription,
  getProviderStatusAsync,
  getForegroundPermissionsAsync,
  useForegroundPermissions,
} from 'expo-location';
import React, {createContext, useContext} from 'react';
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
import {getCoords} from '../lib/coordinateFormat';

export type LocationState = {
  location: LocationObject | undefined;
  throttledMapLocation: LocationObject | undefined;
  locationPermission: PermissionStatus | undefined;
  providerStatus: LocationProviderStatus | undefined;
};

export function createLocationStore() {
  const instance = createStore<LocationState>()(() => {
    return {
      location: undefined,
      throttledMapLocation: undefined,
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

const POLL_PROVIDER_STATUS_INTERVAL = 10000;

export function LocationProvider({children}: {children: React.ReactNode}) {
  const [store] = React.useState(() => createLocationStore());
  const [subscription, setSubscription] =
    React.useState<LocationSubscription | null>(null);

  const [locationPermission] = useForegroundPermissions();

  const queryClient = useQueryClient();

  const startWatchPosition = React.useCallback(() => {
    watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
      },
      location => {
        store.setState(prev => ({...prev, location}));
        const lastThrottledLocation = store.getState().throttledMapLocation;
        if (!lastThrottledLocation) {
          store.setState(prev => ({
            ...prev,
            throttledMapLocation: location,
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
            throttledMapLocation: location,
          }));
          return;
        }
      },
    )
      .then(sub => setSubscription(sub))
      .catch(error => {
        console.error('Failed to start location tracking:', error);
      });
  }, [store, setSubscription]);

  React.useEffect(() => {
    if (locationPermission && locationPermission.granted && !subscription) {
      startWatchPosition();
    }
    return () => {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, [subscription, locationPermission, startWatchPosition]);

  React.useEffect(() => {
    let ignore = false;
    async function checkProviderStatus() {
      getProviderStatusAsync()
        .then(status => {
          if (ignore) return;
          if (!status.locationServicesEnabled) {
            queryClient.invalidateQueries({queryKey: ['lastLocation']});
          }

          store.setState(store => ({
            ...store,
            providerStatus: status,
            ...(!status.locationServicesEnabled
              ? {location: undefined, throttledMapLocation: undefined}
              : {}),
          }));
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
        if (newPermissionStatus === 'granted' && !subscription) {
          startWatchPosition();
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
  }, [store, startWatchPosition]);

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
