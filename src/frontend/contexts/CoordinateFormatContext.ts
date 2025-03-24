import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {type CoordinateFormat} from '../lib/coordinateFormat';

export type CoordinateFormatState = CoordinateFormat;

// NOTE: Do not change!
const STORAGE_KEY = 'coordinate-format' as const;

function createInitialState(): CoordinateFormatState {
  return 'utm';
}

export function createCoordinateFormatStore({persist} = {persist: false}) {
  let store: StoreApi<CoordinateFormatState>;

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
    setFormat: (format: CoordinateFormat) => {
      store.setState(format);
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type CoordinateFormatStore = ReturnType<
  typeof createCoordinateFormatStore
>;

export const CoordinateFormatContext =
  createContext<CoordinateFormatStore | null>(null);
export const CoordinateFormatProvider = CoordinateFormatContext.Provider;

function useCoordinateFormatContext() {
  const value = useContext(CoordinateFormatContext);

  if (!value) {
    throw new Error('Must set up the CoordinateFormatProvider first');
  }

  return value;
}

export function useCoordinateFormatState(): CoordinateFormatState {
  const {instance} = useCoordinateFormatContext();
  return useStore(instance);
}

export function useCoordinateFormatActions() {
  const {actions} = useCoordinateFormatContext();
  return actions;
}
