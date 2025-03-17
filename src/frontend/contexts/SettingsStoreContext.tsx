import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {
  CoordinateFormatSchema,
  type CoordinateFormat,
} from '../lib/coordinateFormat';

export const SettingsStateSchema = v.object({
  coordinateFormat: v.union([CoordinateFormatSchema, v.null()]),
  locale: v.union([
    v.object({
      languageTag: v.string(),
    }),
    v.null(),
  ]),
  manualCoordinateEntryFormat: v.union([CoordinateFormatSchema, v.null()]),
  metricsDiagnosticsPermissionsEnabled: v.union([v.boolean(), v.null()]),
});

export type SettingsState = v.InferOutput<typeof SettingsStateSchema>;

// NOTE: Do not change!
export const STORAGE_KEY = 'Settings' as const;

function createInitialState(): SettingsState {
  return {
    coordinateFormat: null,
    locale: null,
    manualCoordinateEntryFormat: null,
    metricsDiagnosticsPermissionsEnabled: null,
  };
}

export function createSettingsStore({persist} = {persist: false}) {
  let store: StoreApi<SettingsState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 1,
        migrate: (persistedState, version): SettingsState => {
          const migratedState = createInitialState();

          if (version === 0) {
            if (typeof persistedState !== 'object') return migratedState;
            if (persistedState === null) return migratedState;

            if (
              'coordinateFormat' in persistedState &&
              v.is(CoordinateFormatSchema, persistedState.coordinateFormat)
            ) {
              migratedState.coordinateFormat = persistedState.coordinateFormat;
            }

            if (
              'manualCoordinateEntryFormat' in persistedState &&
              v.is(
                CoordinateFormatSchema,
                persistedState.manualCoordinateEntryFormat,
              )
            ) {
              migratedState.manualCoordinateEntryFormat =
                persistedState.manualCoordinateEntryFormat;
            }
          }

          return migratedState;
        },
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setLocale: (locale: SettingsState['locale']) => {
      store.setState({locale});
    },
    setMetricsDiagnosticsPermissions: (enabled: boolean) => {
      store.setState({metricsDiagnosticsPermissionsEnabled: enabled});
    },
    setCoordinateFormat: (coordinateFormat: CoordinateFormat) => {
      store.setState({coordinateFormat});
    },
    setManualCoordinateEntryFormat: (coordinateFormat: CoordinateFormat) => {
      store.setState({manualCoordinateEntryFormat: coordinateFormat});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type SettingsStore = ReturnType<typeof createSettingsStore>;

export const SettingsStoreContext = createContext<SettingsStore | null>(null);

export const SettingsStoreProvider = SettingsStoreContext.Provider;

function useSettingsStoreContext() {
  const value = useContext(SettingsStoreContext);

  if (!value) {
    throw new Error('Must set up SettingsStoreProvider first');
  }

  return value;
}

export function useSettingsState(): SettingsState;
export function useSettingsState<T>(selector: (state: SettingsState) => T): T;
export function useSettingsState<T>(selector?: (state: SettingsState) => T) {
  const {instance} = useSettingsStoreContext();
  return useStore(instance, selector!);
}

export function useSettingsActions() {
  const {actions} = useSettingsStoreContext();
  return actions;
}
