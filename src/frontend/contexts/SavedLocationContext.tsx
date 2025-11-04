import {createContext, useContext} from 'react';
import {createStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {LocationObject} from 'expo-location';

// Do not change!
export const STORAGE_KEY = 'savedLocation' as const;

const SavedLocationContext = createContext<SavedLocationStore | null>(null);

export const SavedLocationStoreProvider = SavedLocationContext.Provider;

export function createInitialState() {
  return {savedLocation: null};
}

type SavedLocationState = {savedLocation: LocationObject | null};

export function createSavedLocationStore({persist} = {persist: false}) {
  let store: StoreApi<SavedLocationState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setSavedLocation: (location: LocationObject | null) => {
      store.setState({savedLocation: location});
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
 * This hook provides the last saved location but is NOT reactive to state. Currently it is only being used once when the map is initially loading, so the consuming component does not need it to be reactive.
 */
export function useNonReactiveSavedLocation() {
  const {instance} = useSavedLocationContext();
  return instance.getState();
}

export function useSavedLocationActions() {
  const {actions} = useSavedLocationContext();
  return actions;
}
