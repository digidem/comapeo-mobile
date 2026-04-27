import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

export type UnitSystem = 'metric' | 'imperial';

type UnitSystemState = {
  value: UnitSystem;
};

// NOTE: Do not change!
const STORAGE_KEY = 'unit-system' as const;

function createInitialState(): UnitSystemState {
  return {
    value: 'metric',
  };
}

export function createUnitSystemStore({persist} = {persist: false}) {
  let store: StoreApi<UnitSystemState>;

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
    setUnitSystem: (unitSystem: UnitSystem) => {
      store.setState({value: unitSystem});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type UnitSystemStore = ReturnType<typeof createUnitSystemStore>;

export const UnitSystemStoreContext = createContext<UnitSystemStore | null>(
  null,
);
export const UnitSystemStoreProvider = UnitSystemStoreContext.Provider;

function useUnitSystemStoreContext() {
  const value = useContext(UnitSystemStoreContext);

  if (!value) {
    throw new Error('Must set up the UnitSystemStoreProvider first');
  }

  return value;
}

export function useUnitSystem(): UnitSystem {
  const {instance} = useUnitSystemStoreContext();
  return useStore(instance).value;
}

export function useUnitSystemActions() {
  const {actions} = useUnitSystemStoreContext();
  return actions;
}
