import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {useShallow} from 'zustand/react/shallow';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {CoordinateFormatSchema} from '../lib/coordinateFormat';
import {SetNonNullable} from 'type-fest';

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

/**
 * "Raw" settings state
 */
export type Settings = v.InferOutput<typeof SettingsStateSchema>;

/**
 * Settings fields that use a default value if missing
 */
type SettingWithDefault =
  | 'coordinateFormat'
  | 'manualCoordinateEntryFormat'
  | 'metricsDiagnosticsPermissionsEnabled';

/**
 * Settings with defaults filled in
 */
export type ResolvedSettings = SetNonNullable<Settings, SettingWithDefault>;

const SETTINGS_DEFAULTS = {
  coordinateFormat: 'utm',
  manualCoordinateEntryFormat: 'utm',
  metricsDiagnosticsPermissionsEnabled: true,
} as const satisfies Pick<ResolvedSettings, SettingWithDefault>;

// NOTE: Do not change!
export const STORAGE_KEY = 'Settings' as const;

function createInitialState(): Settings {
  return {
    coordinateFormat: null,
    locale: null,
    manualCoordinateEntryFormat: null,
    metricsDiagnosticsPermissionsEnabled: null,
  };
}

export function createSettingsStore({persist} = {persist: false}) {
  let store: StoreApi<Settings>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 1,
        migrate: (persistedState, version): Settings => {
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

  return {
    instance: store,
    actions: {
      setSetting: <T extends keyof Settings>(key: T, value: Settings[T]) => {
        v.assert(SettingsStateSchema.entries[key], value);
        store.setState({[key]: value});
      },
    },
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

export function useSettingsState(): ResolvedSettings;
export function useSettingsState<T>(
  selector: (state: ResolvedSettings) => T,
): T;
export function useSettingsState<T>(selector?: (state: ResolvedSettings) => T) {
  const {instance} = useSettingsStoreContext();

  return useStore(
    instance,
    useShallow(state => {
      const resolvedState: ResolvedSettings = {
        ...state,
        coordinateFormat:
          state.coordinateFormat ?? SETTINGS_DEFAULTS.coordinateFormat,
        manualCoordinateEntryFormat:
          state.manualCoordinateEntryFormat ??
          SETTINGS_DEFAULTS.manualCoordinateEntryFormat,
        metricsDiagnosticsPermissionsEnabled:
          state.metricsDiagnosticsPermissionsEnabled ??
          SETTINGS_DEFAULTS.metricsDiagnosticsPermissionsEnabled,
      };

      return selector ? selector(resolvedState) : resolvedState;
    }),
  );
}

export function useSettingsActions() {
  const {actions} = useSettingsStoreContext();
  return actions;
}
