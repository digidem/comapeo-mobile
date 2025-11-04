import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

type MetricsDiagnosticsState = {
  isEnabled: boolean;
};

// NOTE: Do not change!
const STORAGE_KEY = 'MetricDiagnosticsPermission' as const;

function createInitialState(): MetricsDiagnosticsState {
  return {
    isEnabled: true,
  };
}

export function createMetricsDiagnosticsStore({persist} = {persist: false}) {
  let store: StoreApi<MetricsDiagnosticsState>;

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
    setIsEnabled: (value: boolean) => {
      store.setState({isEnabled: value});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type MetricsDiagnosticsStore = ReturnType<
  typeof createMetricsDiagnosticsStore
>;

const MetricsDiagnosticsStoreContext =
  createContext<MetricsDiagnosticsStore | null>(null);

export const MetricsDiagnosticsStoreProvider =
  MetricsDiagnosticsStoreContext.Provider;

function useMetricsDiagnosticsStoreContext() {
  const value = useContext(MetricsDiagnosticsStoreContext);

  if (!value) {
    throw new Error('Must set up the MetricsDiagnosticsStoreProvider first');
  }

  return value;
}

export function useMetricsDiagnosticsEnabled(): boolean {
  const {instance} = useMetricsDiagnosticsStoreContext();
  return useStore(instance).isEnabled;
}

export function useMetricsDiagnosticsActions() {
  const {actions} = useMetricsDiagnosticsStoreContext();
  return actions;
}
