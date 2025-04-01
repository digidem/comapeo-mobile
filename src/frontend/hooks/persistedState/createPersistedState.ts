import {StateCreator, create, createStore} from 'zustand';
import {persist, createJSONStorage, PersistOptions} from 'zustand/middleware';
import {MMKVZustandStorage} from '../../App';

type PersistedStoreKey =
  | 'MapeoLocale'
  | '@MapeoDraft'
  | 'MapeoTrack'
  | 'Passcode'
  | 'ActiveProjectId'
  | 'Settings'
  | 'MetricDiagnosticsPermission';

type MigrationOpt<T> =
  | {version: number; migrateFn: PersistOptions<T, T>['migrate']}
  | {version: number};

export function createPersistedState<T>(
  ...args: Parameters<typeof createPersistMiddleware<T>>
) {
  const store = create<T>()(createPersistMiddleware(...args));

  store.setState(state => ({
    ...state,
    ...args[0],
  }));

  return store;
}

export function createPersistedStore<T>(
  ...args: Parameters<typeof createPersistMiddleware<T>>
) {
  const store = createStore<T>()(createPersistMiddleware(...args));
  store.setState(state => ({
    ...state,
    ...args[0],
  }));

  return store;
}

function createPersistMiddleware<State>(
  slice: StateCreator<State>,
  persistedStoreKey: PersistedStoreKey,
  migrationOpt?: MigrationOpt<State>,
) {
  return persist(slice, {
    name: persistedStoreKey,
    storage: createJSONStorage(() => MMKVZustandStorage),
    version: migrationOpt?.version,
    partialize: state => {
      if (typeof state === 'object' && state && 'actions' in state) {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          actions,
          ...other
        } = state;
        return other;
      }
      return state;
    },
    migrate:
      migrationOpt && 'migrateFn' in migrationOpt
        ? migrationOpt.migrateFn
        : undefined,
  });
}
