import {createContext, use} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

// Do not change!
export const STORAGE_KEY = 'AppUsageStatsPrompt';

export const AppUsageStatsSchemaV0 = v.object({
  optedIn: v.union([v.boolean(), v.null()]),
  completedOnboardingAt: v.union([v.number(), v.null()]),
  lastPromptAt: v.union([v.number(), v.null()]),
  promptCount: v.number(),
  optInStartedAt: v.optional(v.union([v.number(), v.null()])),
});

export type AppUsageStatsState = v.InferOutput<typeof AppUsageStatsSchemaV0>;

const initialState: AppUsageStatsState = {
  optedIn: null,
  completedOnboardingAt: null,
  lastPromptAt: null,
  promptCount: 0,
  optInStartedAt: null,
};

function createInitialState(): AppUsageStatsState {
  return {
    optedIn: null,
    completedOnboardingAt: null,
    lastPromptAt: null,
    promptCount: 0,
    optInStartedAt: null,
  };
}

type createAppUsageStatsStoreProps = {
  persist?: boolean;
  appUsageMetricsOptIn: () => void;
  appUsageMetricsOptOut: () => void;
};

export function createAppUsageStatsStore({
  persist = false,
  appUsageMetricsOptIn,
  appUsageMetricsOptOut,
}: createAppUsageStatsStoreProps) {
  let store: StoreApi<AppUsageStatsState>;

  if (persist) {
    store = createStore(
      createPersistedState<AppUsageStatsState>(() => initialState, {
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
    setOptedIn: (optedIn: boolean) => {
      const now = Date.now();
      const state = store.getState();

      appUsageMetricsOptIn();
      if (optedIn) {
        store.setState({
          optedIn: true,
          lastPromptAt: now,
          promptCount: state.promptCount,
          optInStartedAt: now,
        });
      } else {
        appUsageMetricsOptOut();
        store.setState({
          optedIn: false,
          lastPromptAt: now,
          promptCount: state.promptCount + 1,
          optInStartedAt: null,
        });
      }
    },
  };

  return {instance: store, actions};
}

export type AppUsageStatsStore = ReturnType<typeof createAppUsageStatsStore>;

const AppUsageStatsPromptContext = createContext<AppUsageStatsStore | null>(
  null,
);

export const AppUsageStatsPromptProvider = AppUsageStatsPromptContext.Provider;

function useAppUsageStatsStore() {
  const value = use(AppUsageStatsPromptContext);
  if (!value) {
    throw new Error('AppUsageStatsPromptProvider missing');
  }
  return value;
}

export function useAppUsageStatsState<T>(
  selector: (state: AppUsageStatsState) => T,
): T {
  const {instance} = useAppUsageStatsStore();
  return useStore(instance, selector);
}

export function useAppUsageStatsPromptActions() {
  const {actions} = useAppUsageStatsStore();
  return actions;
}
