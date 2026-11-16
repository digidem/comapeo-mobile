import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {type CoordinateFormat} from '../lib/coordinateFormat';

type CoordinateFormatState = {
  value: CoordinateFormat;
};

// NOTE: Do not change!
const STORAGE_KEY = 'coordinate-format' as const;

// Zustand's persist middleware and using `createJSONStorage()` assumes that states are represented as objects.
// Using a scalar value requires tedious workarounds that are more trouble than shaping the state according to Zustand's assumptions.
// https://github.com/pmndrs/zustand/blob/17e281fd75a8200e3598658e732b8b4a3055f0b1/src/middleware/persist.ts#L181-L184
function createInitialState(): CoordinateFormatState {
  return {
    value: 'utm',
  };
}

export function createCoordinateFormatStore({persist} = {persist: false}) {
  let store: StoreApi<CoordinateFormatState>;

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
    setFormat: (format: CoordinateFormat) => {
      store.setState({value: format});
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

export const CoordinateFormatStoreContext =
  createContext<CoordinateFormatStore | null>(null);
export const CoordinateFormatStoreProvider =
  CoordinateFormatStoreContext.Provider;

function useCoordinateFormatStoreContext() {
  const value = useContext(CoordinateFormatStoreContext);

  if (!value) {
    throw new Error('Must set up the CoordinateFormatStoreProvider first');
  }

  return value;
}

export function useCoordinateFormat(): CoordinateFormat {
  const {instance} = useCoordinateFormatStoreContext();
  return useStore(instance).value;
}

export function useCoordinateFormatActions() {
  const {actions} = useCoordinateFormatStoreContext();
  return actions;
}
