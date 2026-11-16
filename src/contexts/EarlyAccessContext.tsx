import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import * as v from 'valibot';
import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

// NOTE: Do not change!
export const STORAGE_KEY = 'EarlyAccessStore' as const;

export const EarlyAccessStateSchema = v.object({
  isEarlyAccessEnabled: v.boolean(),
});

export type EarlyAccessState = v.InferOutput<typeof EarlyAccessStateSchema>;

type EarlyAccessActions = {
  setEarlyAccessEnabled: (enabled: boolean) => void;
};

function createInitialState(): EarlyAccessState {
  return {isEarlyAccessEnabled: false};
}

export function createEarlyAccessStore({persist} = {persist: false}) {
  let store: StoreApi<EarlyAccessState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions: EarlyAccessActions = {
    setEarlyAccessEnabled: (enabled: boolean) => {
      store.setState({isEarlyAccessEnabled: enabled});
    },
  };

  return {instance: store, actions};
}

export type EarlyAccessStore = ReturnType<typeof createEarlyAccessStore>;

const EarlyAccessStoreContext = createContext<EarlyAccessStore | null>(null);

export const EarlyAccessStoreProvider = EarlyAccessStoreContext.Provider;

function useEarlyAccessStoreContext() {
  const value = useContext(EarlyAccessStoreContext);
  if (!value) throw new Error('EarlyAccessStoreProvider missing');
  return value;
}

export function useEarlyAccessState<T>(
  selector: (s: EarlyAccessState) => T,
): T {
  const {instance} = useEarlyAccessStoreContext();
  return useStore(instance, selector);
}

export function useEarlyAccessActions(): EarlyAccessActions {
  const {actions} = useEarlyAccessStoreContext();
  return actions;
}
