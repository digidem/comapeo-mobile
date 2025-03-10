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
import {DEFAULT_OBSCURE_CODE, isValidPasscode} from '../lib/security';

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
  obscureCode: v.union([v.string(), v.null()]),
  passcode: v.union([v.string(), v.null()]),
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
    obscureCode: null,
    passcode: null,
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
    setPasscode: (passcode: SettingsState['passcode']) => {
      if (passcode === DEFAULT_OBSCURE_CODE) {
        throw new Error('Passcode is reserved');
      }

      // Obscure code needs to be unset when passcode is unset
      if (passcode === null) {
        store.setState({passcode, obscureCode: null});
        return;
      }

      const {obscureCode} = store.getState();

      if (passcode === obscureCode) {
        throw new Error('Passcode is already being used as obscure code');
      }

      if (!isValidPasscode(passcode)) {
        throw new Error('Passcode is invalid');
      }

      store.setState({passcode});
    },
    enableObscureCode: (enabled: boolean) => {
      const {passcode} = store.getState();

      if (passcode === null) {
        throw new Error('Cannot enable obscure code if passcode is not set');
      }

      store.setState({obscureCode: enabled ? DEFAULT_OBSCURE_CODE : null});
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
