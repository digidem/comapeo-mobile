import {StateCreator, create} from 'zustand';
import {persist, createJSONStorage, PersistOptions} from 'zustand/middleware';

import {MMKV_ZUSTAND_STATE_STORAGE} from '../../constants';

type PersistedStoreKey = '@MapeoDraft';

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
    storage: createJSONStorage(() => MMKV_ZUSTAND_STATE_STORAGE),
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
