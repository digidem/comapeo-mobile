import {
  watchPositionAsync,
  Accuracy,
  LocationSubscription,
  getProviderStatusAsync,
  getForegroundPermissionsAsync,
} from 'expo-location';
import React, {createContext, useContext} from 'react';
import CheapRuler from 'cheap-ruler';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {AppState, AppStateStatus} from 'react-native';
import {StoreApi, useStore} from 'zustand';
import * as Sentry from '@sentry/react-native';

import {
  LocationObject,
  PermissionStatus,
  LocationProviderStatus,
} from 'expo-location';
import {createStore} from 'zustand';
import {getCoords} from '../lib/coordinateFormat';
import {Loading} from '../sharedComponents/Loading';
import {FatalError} from '../screens/FatalError';

export type LocationState = {
  location: LocationObject | undefined;
  throttledMapLocation: LocationObject | undefined;
  locationPermission: PermissionStatus;
  providerStatus: LocationProviderStatus;
};

export function useLocationState(): LocationState;
export function useLocationState<T>(selector: (state: LocationState) => T): T;
export function useLocationState<T>(selector?: (state: LocationState) => T) {
  const store = useLocationContext();
  return useStore(store, selector!);
}

const LocationContext = createContext<StoreApi<LocationState> | null>(null);

const POLL_PROVIDER_STATUS_INTERVAL = 10000;

export function LocationProvider({children}: {children: React.ReactNode}) {
  const {
    data: permissions,
    isPending: permissionsPending,
    isError: permissionsError,
  } = useQuery({
    queryKey: ['LocationPermission'],
    queryFn: () => {
      return getForegroundPermissionsAsync();
    },
  });

  const {
    data: providerStatus,
    isPending: providerStatusPending,
    isError: providerStatusError,
  } = useQuery({
    queryKey: ['LocationProviderStatus'],
    queryFn: () => {
      return getProviderStatusAsync();
    },
  });

  if (permissionsPending || providerStatusPending) {
    return <Loading />;
  }

  if (permissionsError || providerStatusError) {
    return <FatalError />;
  }

  return (
    <LocationProviderInitialized
      initialLocationPermission={permissions.status}
      initialProviderStatus={providerStatus}>
      {children}
    </LocationProviderInitialized>
  );
}

function LocationProviderInitialized({
  children,
  initialLocationPermission,
  initialProviderStatus,
}: {
  children: React.ReactNode;
  initialLocationPermission: PermissionStatus;
  initialProviderStatus: LocationProviderStatus;
}) {
  const [store] = React.useState(() =>
    createStore<LocationState>()(() => {
      return {
        location: undefined,
        throttledMapLocation: undefined,
        locationPermission: initialLocationPermission,
        providerStatus: initialProviderStatus,
      };
    }),
  );

  usePollProviderStatus(store);

  useCheckPermissionOnAppStateChange(store);

  React.useEffect(() => {
    let unsub: (() => void) | null = null;
    let locationSubscription: LocationSubscription | null = null;
    let isMounted = true;

    const handleCheckAndStartWatchPosition = () => {
      if (!isMounted || locationSubscription) return;

      startWatchPosition(store).then(sub => {
        if (isMounted) {
          locationSubscription = sub;
        } else {
          // If unmounted before promise resolves, clean up immediately
          sub.remove();
        }
      });
    };

    const initialPermissionGranted =
      store.getState().locationPermission === 'granted';

    const initialGPSEnabled =
      store.getState().providerStatus.locationServicesEnabled;

    // if we have permission and GPS enabled, start watching position immediately
    if (initialPermissionGranted && initialGPSEnabled) {
      handleCheckAndStartWatchPosition();
    }
    // otherwise, subscribe to store updates to check when permission is granted and GPS is enabled to start watching position
    else {
      unsub = store.subscribe(() => {
        const currentState = store.getState();
        if (
          currentState.locationPermission === 'granted' &&
          currentState.providerStatus.locationServicesEnabled
        ) {
          handleCheckAndStartWatchPosition();
        }
      });
    }

    return () => {
      isMounted = false;

      if (unsub) {
        unsub();
        unsub = null;
      }

      if (locationSubscription) {
        locationSubscription.remove();
        locationSubscription = null;
      }
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

function startWatchPosition(store: StoreApi<LocationState>) {
  return watchPositionAsync(
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

      const timeElapsed = location.timestamp - lastThrottledLocation.timestamp;

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
  );
}

function useCheckPermissionOnAppStateChange(store: StoreApi<LocationState>) {
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
            // dont return stale location
            ...(newPermissionStatus !== PermissionStatus.GRANTED
              ? {location: undefined, throttledMapLocation: undefined}
              : {}),
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
}

function usePollProviderStatus(store: StoreApi<LocationState>) {
  const queryClient = useQueryClient();
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
            // dont return stale location
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
}
