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
import {FullScreenCenteredLoader} from '../sharedComponents/FullScreenCenteredLoader';
import {FatalError} from '../screens/FatalError';
import {useSavedLocationActions} from './SavedLocationContext';

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
const MIN_MS_BETWEEN_UPDATE = 1000;
const MIN_METERS_BETWEEN_UPDATE = 5;

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
    return <FullScreenCenteredLoader />;
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

      startWatchPosition(store)
        .then(sub => {
          if (isMounted) {
            locationSubscription = sub;
          } else {
            // If unmounted before promise resolves, clean up immediately
            sub.remove();
          }
        })
        .catch(Sentry.captureException);
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

  return <LocationContext value={store}>{children}</LocationContext>;
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
      // Don't show Google Play Services' "improve location accuracy" dialog
      // (only triggered when the network provider is off): it pushes a
      // network/Wi-Fi-based accuracy mode that's useless offline, and if the
      // user dismisses it, watching never starts. Use available providers (GPS).
      mayShowUserSettingsDialog: false,
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

      if (timeElapsed < MIN_MS_BETWEEN_UPDATE) return;

      const coords = getCoords(location);
      const lastCoords = getCoords(lastThrottledLocation);
      const ruler = new CheapRuler(lastCoords[1], 'meters');
      const distance = ruler.distance(coords, lastCoords);

      if (distance > MIN_METERS_BETWEEN_UPDATE) {
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
  const {setSavedLocation} = useSavedLocationActions();

  React.useEffect(() => {
    let isCancelled = false;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (isCancelled) return;

      const location = store.getState().location;
      // update saved location when app goes in the background
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (location) setSavedLocation(location);
        return;
      }

      if (nextAppState === 'active') {
        const {status: newPermissionStatus} =
          await getForegroundPermissionsAsync();
        if (isCancelled) return;

        const {locationPermission} = store.getState();

        if (newPermissionStatus !== locationPermission) {
          // if the user removed permission, update saved location
          if (newPermissionStatus !== PermissionStatus.GRANTED && location) {
            setSavedLocation(location);
          }

          store.setState(state => ({
            ...state,
            locationPermission: newPermissionStatus,
            // don't return stale location
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
  }, [store, setSavedLocation]);
}

function usePollProviderStatus(store: StoreApi<LocationState>) {
  const queryClient = useQueryClient();
  const {setSavedLocation} = useSavedLocationActions();

  React.useEffect(() => {
    let ignore = false;

    const checkProviderStatus = async () => {
      try {
        const status = await getProviderStatusAsync();
        if (ignore) return;

        const locationServicesEnabled = status.locationServicesEnabled;
        const location = store.getState().location;

        if (!locationServicesEnabled) {
          queryClient.invalidateQueries({queryKey: ['lastLocation']});
          if (location) setSavedLocation(location);
        }

        store.setState(prevState => ({
          ...prevState,
          providerStatus: status,
          // dont provide a stale location
          ...(locationServicesEnabled
            ? {}
            : {location: undefined, throttledMapLocation: undefined}),
        }));
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    // Initial call
    checkProviderStatus();
    const intervalId = setInterval(
      checkProviderStatus,
      POLL_PROVIDER_STATUS_INTERVAL,
    );

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [store, queryClient, setSavedLocation]);
}
