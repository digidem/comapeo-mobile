import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

type ActiveProjectIdState = {
  projectId?: string;
};

// NOTE: Do not change!
const STORAGE_KEY = 'ActiveProjectId' as const;

function createInitialState(): ActiveProjectIdState {
  return {};
}

export function createActiveProjectIdStore({persist} = {persist: false}) {
  let store: StoreApi<ActiveProjectIdState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 1,
        migrate: (persistedState, version): ActiveProjectIdState => {
          const newState = createInitialState();

          if (version === 0) {
            if (typeof persistedState !== 'object') return newState;
            if (persistedState === null) return newState;

            if (
              'projectId' in persistedState &&
              typeof persistedState.projectId === 'string'
            ) {
              return {
                projectId: persistedState.projectId,
              };
            }
          }

          return newState;
        },
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setActiveProjectId: (projectId: string) => {
      store.setState({projectId});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type ActiveProjectIdStore = ReturnType<
  typeof createActiveProjectIdStore
>;

const ActiveProjectIdStoreContext = createContext<ActiveProjectIdStore | null>(
  null,
);

export const ActiveProjectIdStoreProvider =
  ActiveProjectIdStoreContext.Provider;

function useActiveProjectIdStoreContext() {
  const value = useContext(ActiveProjectIdStoreContext);

  if (!value) {
    throw new Error('Must set up the ActiveProjectIdStoreContext');
  }

  return value;
}

export function useActiveProjectId(): string | undefined {
  const {instance} = useActiveProjectIdStoreContext();
  return useStore(instance).projectId;
}

export function useActiveProjectIdActions() {
  const {actions} = useActiveProjectIdStoreContext();
  return actions;
}
