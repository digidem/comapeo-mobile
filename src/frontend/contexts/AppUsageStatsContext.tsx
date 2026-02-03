import {createContext, use, useEffect} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';

// Do not change!
export const STORAGE_KEY = 'AppUsageStats';

export const AppUsageStatsSchemaV0 = v.object({
  completedOnboardingAt: v.union([v.number(), v.null()]),
  lastPromptAt: v.union([v.number(), v.null()]),
  promptCount: v.number(),
  optInStartedAt: v.optional(v.union([v.number(), v.null()])),
});

export type AppUsageStatsState = v.InferOutput<typeof AppUsageStatsSchemaV0>;

const initialState: AppUsageStatsState = {
  completedOnboardingAt: null,
  lastPromptAt: null,
  promptCount: 0,
  optInStartedAt: null,
};

function createInitialState(): AppUsageStatsState {
  return {
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
        storage: createJSONStorage(() => MMKVStoreInitializer),
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    recordCompleteOnboarding: () => {
      store.setState({completedOnboardingAt: Date.now()});
    },
    setOptedIn: (optedIn: boolean) => {
      const now = Date.now();
      const state = store.getState();

      if (optedIn) {
        appUsageMetricsOptIn();
        store.setState({
          lastPromptAt: now,
          promptCount: state.promptCount,
          optInStartedAt: now,
        });
      } else {
        appUsageMetricsOptOut();
        store.setState({
          lastPromptAt: now,
          promptCount: state.promptCount + 1,
          optInStartedAt: null,
        });
      }
    },
    resetOptInAndTimer: () => {
      const completedOnboardingAt = store.getState().completedOnboardingAt;
      appUsageMetricsOptOut();
      store.setState({
        completedOnboardingAt,
        lastPromptAt: null,
        promptCount: 0,
        optInStartedAt: null,
      });
    },
  };

  return {instance: store, actions};
}

export type AppUsageStatsStore = ReturnType<typeof createAppUsageStatsStore>;

const AppUsageStatsContext = createContext<AppUsageStatsStore | null>(null);

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export const AppUsageStatsProvider = ({
  value,
  children,
}: {
  children: React.ReactNode;
  value: AppUsageStatsStore;
}) => {
  useEffect(() => {
    const optInStartedAt = value.instance.getState().optInStartedAt;
    if (optInStartedAt && Date.now() - optInStartedAt > ONE_YEAR_MS) {
      value.actions.resetOptInAndTimer();
    }
  }, [value]);

  return <AppUsageStatsContext value={value}>{children}</AppUsageStatsContext>;
};

export function useAppUsageStatsStore() {
  const value = use(AppUsageStatsContext);
  if (!value) {
    throw new Error('AppUsageStatsProvider missing');
  }
  return value;
}

export function useAppUsageStatsState<T>(
  selector: (state: AppUsageStatsState) => T,
): T {
  const {instance} = useAppUsageStatsStore();
  return useStore(instance, selector);
}

export function useAppUsageStatsActions() {
  const {actions} = useAppUsageStatsStore();
  return actions;
}
