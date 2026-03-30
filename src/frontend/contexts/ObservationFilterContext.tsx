import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import * as v from 'valibot';
import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

// NOTE: Do not change!
export const STORAGE_KEY = 'ObservationFilterStore' as const;

const AUTO_RESET_TIMEOUT = 60 * 60 * 1000;

export const ObservationFilterSchema = v.object({
  filterMode: v.union([v.literal('all'), v.literal('mine')]),
  lastInteractionTimestamp: v.number(),
  projectId: v.string(),
});

export type ObservationFilterState = v.InferOutput<
  typeof ObservationFilterSchema
>;

type ObservationFilterActions = {
  setFilterMode: (mode: 'all' | 'mine') => void;
  checkAndResetIfNeeded: () => void;
  handleProjectChange: (projectId: string) => void;
};

function createInitialState(projectId: string): ObservationFilterState {
  return {
    filterMode: 'all',
    lastInteractionTimestamp: Date.now(),
    projectId,
  };
}

export function createObservationFilterStore({persist} = {persist: false}) {
  let store: StoreApi<ObservationFilterState>;

  if (persist) {
    store = createStore(
      createPersistedState(() => createInitialState(''), {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 0,
      }),
    );
  } else {
    store = createStore(() => createInitialState(''));
  }

  const actions: ObservationFilterActions = {
    setFilterMode: (mode: 'all' | 'mine') => {
      store.setState({
        filterMode: mode,
        lastInteractionTimestamp: Date.now(),
      });
    },
    checkAndResetIfNeeded: () => {
      const state = store.getState();
      const now = Date.now();
      const timeSinceLastInteraction = now - state.lastInteractionTimestamp;

      if (
        timeSinceLastInteraction > AUTO_RESET_TIMEOUT &&
        state.filterMode !== 'all'
      ) {
        store.setState({
          filterMode: 'all',
          lastInteractionTimestamp: now,
        });
      }
    },
    handleProjectChange: (projectId: string) => {
      const currentState = store.getState();
      if (currentState.projectId !== projectId) {
        store.setState({
          ...createInitialState(projectId),
          filterMode: 'all',
        });
      }
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type ObservationFilterStore = ReturnType<
  typeof createObservationFilterStore
>;

const ObservationFilterStoreContext =
  createContext<ObservationFilterStore | null>(null);

export const ObservationFilterStoreProvider =
  ObservationFilterStoreContext.Provider;

function useObservationFilterStoreContext() {
  const value = useContext(ObservationFilterStoreContext);
  if (!value) throw new Error('ObservationFilterStoreProvider missing');
  return value;
}

export function useObservationFilterState<T>(
  selector: (s: ObservationFilterState) => T,
): T {
  const {instance} = useObservationFilterStoreContext();
  return useStore(instance, selector);
}

export function useObservationFilterActions(): ObservationFilterActions {
  const {actions} = useObservationFilterStoreContext();
  return actions;
}
