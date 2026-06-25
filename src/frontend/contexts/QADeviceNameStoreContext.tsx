import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

// NOTE: Do not change!
const STORAGE_KEY = 'QADeviceNameStore' as const;

export type QADeviceNameState = {
  qaDeviceName: string | null;
};

type QADeviceNameActions = {
  setQADeviceName: (name: string) => void;
};

function createInitialState(): QADeviceNameState {
  return {qaDeviceName: null};
}

export function createQADeviceNameStore({persist} = {persist: false}) {
  let store: StoreApi<QADeviceNameState>;

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

  const actions: QADeviceNameActions = {
    setQADeviceName: (name: string) => {
      store.setState({qaDeviceName: name});
    },
  };

  return {instance: store, actions};
}

export type QADeviceNameStore = ReturnType<typeof createQADeviceNameStore>;

export const QADeviceNameStoreContext = createContext<QADeviceNameStore | null>(
  null,
);

function useQADeviceNameStoreContext() {
  const value = useContext(QADeviceNameStoreContext);
  if (!value) throw new Error('Must set up the QADeviceNameStoreContext first');
  return value;
}

export function useQADeviceName(): string | null {
  const {instance} = useQADeviceNameStoreContext();
  return useStore(instance, s => s.qaDeviceName);
}

export function useQADeviceNameActions(): QADeviceNameActions {
  const {actions} = useQADeviceNameStoreContext();
  return actions;
}
