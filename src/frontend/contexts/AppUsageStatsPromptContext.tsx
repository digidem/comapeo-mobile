import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

// Do not change!
export const STORAGE_KEY = 'AppUsageStatsPrompt';

export const AppUsageStatsPromptSchemaV0 = v.object({
  completedOnboardingAt: v.union([v.number(), v.null()]),
  lastPromptAt: v.union([v.number(), v.null()]),
  promptCount: v.number(),
  optInStartedAt: v.optional(v.union([v.number(), v.null()])),
});

export type AppUsageStatsPromptState = v.InferOutput<
  typeof AppUsageStatsPromptSchemaV0
>;

const initialState: AppUsageStatsPromptState = {
  completedOnboardingAt: null,
  lastPromptAt: null,
  promptCount: 0,
  optInStartedAt: null,
};

function createInitialState(): AppUsageStatsPromptState {
  return {
    completedOnboardingAt: null,
    lastPromptAt: null,
    promptCount: 0,
    optInStartedAt: null,
  };
}

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
    store = createStore(createInitialState);
  }

  const actions = {
    recordCompleteOnboarding: () => {
      const state = store.getState();
      if (!state.completedOnboardingAt) {
        store.setState({completedOnboardingAt: Date.now()});
      }
    },
    setOptedInStartedAt: (date: number) => {
      store.setState({
        lastPromptAt: null,
        promptCount: 0,
        optInStartedAt: date,
      });
    },
    clearOptedInStartedAt: () => {
      store.setState({optInStartedAt: null});
    },
    incrementPromptCount: () => {
      const state = store.getState();
      const now = Date.now();
      store.setState({lastPromptAt: now, promptCount: state.promptCount + 1});
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
