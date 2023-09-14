import {StateCreator, create} from 'zustand';
import {
  StateStorage,
  persist,
  createJSONStorage,
  PersistOptions,
} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

type PersistedStoreKey = 'MapeoLocale' | '@MapeoDraft';

const MMKVZustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

type MigrationOpt<T> =
  | {version: number; migrateFn: PersistOptions<T, T>['migrate']}
  | {version: number};

export function createPersistedState<T>(
  slice: StateCreator<T>,
  persistedStoreKey: PersistedStoreKey,
  migrationOpt?: MigrationOpt<T>,
) {
  return create<T>()(
    persist(slice, {
      name: persistedStoreKey,
      storage: createJSONStorage(() => MMKVZustandStorage),
      version: migrationOpt?.version,
      partialize: state => {
        if (typeof state === 'object' && state && 'actions' in state) {
          const {actions, ...other} = state;
          return other;
        }
        return state;
      },
      migrate:
        migrationOpt && 'migrateFn' in migrationOpt
          ? migrationOpt.migrateFn
          : undefined,
    }),
  );
}
