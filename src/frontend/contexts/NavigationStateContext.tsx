import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import type {NavigationState} from '@react-navigation/native';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

// Zustand's persist middleware and using `createJSONStorage()` assumes that states are represented as objects.
// Using a scalar value requires tedious workarounds that are more trouble than shaping the state according to Zustand's assumptions.
// https://github.com/pmndrs/zustand/blob/17e281fd75a8200e3598658e732b8b4a3055f0b1/src/middleware/persist.ts#L181-L184
type PersistedNavigationState = {
  navigationState?: NavigationState;
};

// NOTE: Do not change!
const STORAGE_KEY = 'MapeoNavigationState' as const;

function createInitialState(): PersistedNavigationState {
  return {};
}

export function createNavigationStateStore({persist} = {persist: false}) {
  let store: StoreApi<PersistedNavigationState>;

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
    setNavigationState: (navigationState: NavigationState) => {
      store.setState({navigationState});
    },
    clearNavigationState: () => {
      store.setState({navigationState: undefined});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type NavigationStateStore = ReturnType<
  typeof createNavigationStateStore
>;

const NavigationStateStoreContext = createContext<NavigationStateStore | null>(
  null,
);
export const NavigationStateStoreProvider =
  NavigationStateStoreContext.Provider;

function useNavigationStateStoreContext() {
  const value = useContext(NavigationStateStoreContext);

  if (!value) {
    throw new Error('Must set up the NavigationStateStoreProvider first');
  }

  return value;
}

export function usePersistedNavigationState(): PersistedNavigationState;
export function usePersistedNavigationState<T>(
  selector: (state: PersistedNavigationState) => T,
): T;
export function usePersistedNavigationState<T>(
  selector?: (state: PersistedNavigationState) => T,
) {
  const {instance} = useNavigationStateStoreContext();
  return useStore(instance, selector!);
}

export function usePersistedNavigationStateActions() {
  const {actions} = useNavigationStateStoreContext();
  return actions;
}
