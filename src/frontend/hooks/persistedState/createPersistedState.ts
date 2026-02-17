import {StateCreator, create} from 'zustand';
import {
  StateStorage,
  persist,
  createJSONStorage,
  PersistOptions,
} from 'zustand/middleware';
import {createMMKV} from 'react-native-mmkv';

export const storage = createMMKV();

type PersistedStoreKey = '@MapeoDraft';

export const MMKVStoreInitializer: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.remove(name);
  },
};

type MigrationOpt<T> =
  | {version: number; migrateFn: PersistOptions<T, T>['migrate']}
  | {version: number};

/**
 * @deprecated Persisted Zustand state should follow the conventions used in `contexts/*StoreContext.tsx`
 */
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

function createPersistMiddleware<State>(
  slice: StateCreator<State>,
  persistedStoreKey: PersistedStoreKey,
  migrationOpt?: MigrationOpt<State>,
) {
  return persist(slice, {
    name: persistedStoreKey,
    storage: createJSONStorage(() => MMKVStoreInitializer),
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
