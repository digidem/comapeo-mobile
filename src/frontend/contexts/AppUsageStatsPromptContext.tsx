import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

interface AppUsageStatsPromptState {
  optedIn: boolean | null; // null = never asked, true = opted in, false = opted out
  completedOnboardingAt: number | null;
  lastPromptAt: number | null;
  promptCount: number;
}

const initialState: AppUsageStatsPromptState = {
  optedIn: null,
  completedOnboardingAt: null,
  lastPromptAt: null,
  promptCount: 0,
};

const STORAGE_KEY = 'AppUsageStatsPrompt';

export function createAppUsageStatsPromptStore({persist} = {persist: false}) {
  let store: StoreApi<AppUsageStatsPromptState>;

  if (persist) {
    store = createStore(
      createPersistedState<AppUsageStatsPromptState>(() => initialState, {
        name: STORAGE_KEY,
        version: 0,
        storage: createJSONStorage(() => MMKVZustandStorage),
      }),
    );
  } else {
    store = createStore(() => initialState);
  }

  const actions = {
    recordCompleteOnboarding: () => {
      const state = store.getState();
      if (!state.completedOnboardingAt) {
        store.setState({completedOnboardingAt: Date.now()});
      }
    },
    setOptedIn: (optedIn: boolean) => {
      const state = store.getState();
      store.setState({
        optedIn,
        lastPromptAt: Date.now(),
        promptCount: optedIn ? state.promptCount : state.promptCount + 1,
      });
    },
  };

  return {instance: store, actions};
}

export type AppUsageStatsPromptStore = ReturnType<
  typeof createAppUsageStatsPromptStore
>;

const AppUsageStatsPromptContext =
  createContext<AppUsageStatsPromptStore | null>(null);

export const AppUsageStatsPromptProvider = AppUsageStatsPromptContext.Provider;

function useAppUsageStatsPromptStore() {
  const value = useContext(AppUsageStatsPromptContext);
  if (!value) {
    throw new Error('AppUsageStatsPromptProvider missing');
  }
  return value;
}

export function useAppUsageStatsPromptState<T>(
  selector: (state: AppUsageStatsPromptState) => T,
): T {
  const {instance} = useAppUsageStatsPromptStore();
  return useStore(instance, selector);
}

export function useAppUsageStatsPromptActions() {
  const {actions} = useAppUsageStatsPromptStore();
  return actions;
}
