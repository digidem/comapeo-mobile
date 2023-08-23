import {StateCreator, create} from 'zustand';
import {
  StateStorage,
  persist,
  createJSONStorage,
  PersistOptions,
} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

type PersistedStoreKey = 'test' | 'MapeoLocale';

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

function createPersistedState<T>(
  slice: StateCreator<T>,
  persistedStoreKey: PersistedStoreKey,
  migrationOpt?: {version: number; migrateFn: PersistOptions<T, T>['migrate']},
) {
  return create<T, [['zustand/persist', T]]>(
    persist(slice, {
      name: persistedStoreKey,
      storage: createJSONStorage(() => MMKVZustandStorage),
      version: migrationOpt?.version,
      migrate: migrationOpt?.migrateFn,
    }),
  );
}
