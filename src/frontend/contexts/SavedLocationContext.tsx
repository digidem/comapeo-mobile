import {createContext, ReactNode, useContext, useEffect} from 'react';
import {createStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {LocationObject} from 'expo-location';
import {AppState, AppStateStatus} from 'react-native';
import {useLocationContext} from './LocationContext';

// Do not change!
export const STORAGE_KEY = 'savedLocation' as const;

const SavedLocationContext = createContext<SavedLocationStore | null>(null);

// store is stable
// eslint-disable-next-line @eslint-react/no-unstable-context-value
export const SavedLocationProvider = ({
  store,
  children,
}: {
  store: SavedLocationStore;
  children: ReactNode;
}) => {
  const locationStore = useLocationContext();
  // persist last known location everytime app goes into the background/is closed
  useEffect(() => {
    let isCancelled = false;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      const currentLocation = locationStore.getState().location;
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isCancelled || !currentLocation) return;
        store.actions.setSavedLocation(currentLocation);
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
  });
  return (
    <SavedLocationContext.Provider value={store}>
      {children}
    </SavedLocationContext.Provider>
  );
};

export function createInitialState() {
  return null;
}

type SavedLocationState = LocationObject | null;

export function createSavedLocationStore({persist} = {persist: false}) {
  let store: StoreApi<SavedLocationState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setSavedLocation: (location: LocationObject | null) => {
      store.setState(location);
    },
  };

  return {instance: store, actions};
}

export type SavedLocationStore = ReturnType<typeof createSavedLocationStore>;

function useSavedLocationContext() {
  const value = useContext(SavedLocationContext);

  if (!value) {
    throw new Error('Must set up Selected SavedLocationStoreProvider first');
  }

  return value;
}

/**
 *
 * This hook provides the last saved location but is NOT reactive to state. Currently it is only being used once when the map is initially loading, so the consuming component does not need to reactive.
 */
export function useNonReactiveSavedLocation() {
  const {instance} = useSavedLocationContext();
  return instance.getState();
}
