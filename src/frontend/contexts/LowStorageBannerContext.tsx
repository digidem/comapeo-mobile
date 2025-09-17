import * as React from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';

type LowStorageBannerState = {
  dismissedMapBannerSession: boolean;
};

type LowStorageBannerActions = {
  setDismissedMapBannerSession: (v: boolean) => void;
};

export type LowStorageBannerStore = {
  instance: StoreApi<LowStorageBannerState>;
  actions: LowStorageBannerActions;
};

function createInitialState(): LowStorageBannerState {
  return {dismissedMapBannerSession: false};
}

export function createLowStorageBannerStore(): LowStorageBannerStore {
  const instance = createStore<LowStorageBannerState>(() => ({
    ...createInitialState(),
  }));

  const actions: LowStorageBannerActions = {
    setDismissedMapBannerSession: v => {
      instance.setState({dismissedMapBannerSession: v});
    },
  };

  return {instance, actions};
}

const LowStorageBannerStoreContext =
  React.createContext<LowStorageBannerStore | null>(null);

export function LowStorageBannerStoreProvider({
  value,
  children,
}: {
  value: LowStorageBannerStore;
  children: React.ReactNode;
}) {
  return (
    <LowStorageBannerStoreContext.Provider value={value}>
      {children}
    </LowStorageBannerStoreContext.Provider>
  );
}

function useLowStorageBannerStoreContext() {
  const ctx = React.useContext(LowStorageBannerStoreContext);
  if (!ctx) throw new Error('Must wrap with LowStorageBannerStoreProvider');
  return ctx;
}

export function useLowStorageBannerState<T>(
  selector: (s: LowStorageBannerState) => T,
): T {
  const {instance} = useLowStorageBannerStoreContext();
  return useStore(instance, selector);
}

export function useLowStorageBannerActions() {
  return useLowStorageBannerStoreContext().actions;
}
