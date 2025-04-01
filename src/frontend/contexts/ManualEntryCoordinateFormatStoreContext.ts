import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {type CoordinateFormat} from '../lib/coordinateFormat';
import {type CreateStoreOpts} from '../sharedTypes';

type ManualEntryCoordinateFormatState = {
  value: CoordinateFormat;
};

// NOTE: Do not change!
const STORAGE_KEY = 'manual-entry-coordinate-format' as const;

// Zustand's persist middleware and using `createJSONStorage()` assumes that states are represented as objects.
// Using a scalar value requires tedious workarounds that are more trouble than shaping the state according to Zustand's assumptions.
// https://github.com/pmndrs/zustand/blob/17e281fd75a8200e3598658e732b8b4a3055f0b1/src/middleware/persist.ts#L181-L184
function createInitialState(): ManualEntryCoordinateFormatState {
  return {
    value: 'utm',
  };
}

export function createManualEntryCoordinateFormatStore(opts: CreateStoreOpts) {
  let store: StoreApi<ManualEntryCoordinateFormatState>;

  if (opts.persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => opts.storage),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setFormat: (format: CoordinateFormat) => {
      store.setState({value: format});
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

export const ManualEntryCoordinateFormatStoreContext =
  createContext<ManualEntryCoordinateFormatStore | null>(null);
export const ManualEntryCoordinateFormatStoreProvider =
  ManualEntryCoordinateFormatStoreContext.Provider;

function useManualEntryCoordinateFormatStoreContext() {
  const value = useContext(ManualEntryCoordinateFormatStoreContext);

  if (!value) {
    throw new Error(
      'Must set up the ManualEntryCoordinateFormatProvider first',
    );
  }

  return value;
}

export function useManualEntryCoordinateFormat(): CoordinateFormat {
  const {instance} = useManualEntryCoordinateFormatStoreContext();
  return useStore(instance).value;
}

export function useManualEntryCoordinateFormatActions() {
  const {actions} = useManualEntryCoordinateFormatStoreContext();
  return actions;
}
