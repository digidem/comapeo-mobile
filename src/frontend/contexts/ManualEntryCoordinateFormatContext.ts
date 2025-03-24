import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {type CoordinateFormat} from '../lib/coordinateFormat';

export type ManualEntryCoordinateFormatState = CoordinateFormat;

// NOTE: Do not change!
const STORAGE_KEY = 'manual-entry-coordinate-format' as const;

function createInitialState(): ManualEntryCoordinateFormatState {
  return 'utm';
}

export function createManualEntryCoordinateFormatStore(
  {persist} = {persist: false},
) {
  let store: StoreApi<ManualEntryCoordinateFormatState>;

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

export type ManualEntryCoordinateFormatStore = ReturnType<
  typeof createManualEntryCoordinateFormatStore
>;

export const ManualEntryCoordinateFormatContext =
  createContext<ManualEntryCoordinateFormatStore | null>(null);
export const ManualEntryCoordinateFormatProvider =
  ManualEntryCoordinateFormatContext.Provider;

function useManualEntryCoordinateFormatContext() {
  const value = useContext(ManualEntryCoordinateFormatContext);

  if (!value) {
    throw new Error(
      'Must set up the ManualEntryCoordinateFormatProvider first',
    );
  }

  return value;
}

export function useManualEntryCoordinateFormatState(): ManualEntryCoordinateFormatState {
  const {instance} = useManualEntryCoordinateFormatContext();
  return useStore(instance);
}

export function useManualEntryCoordinateFormatActions() {
  const {actions} = useManualEntryCoordinateFormatContext();
  return actions;
}
