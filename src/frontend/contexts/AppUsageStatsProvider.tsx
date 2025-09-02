import {usePostHog} from 'posthog-react-native';
import React, {createContext, useCallback, useEffect, useMemo} from 'react';
import {
  useAppUsageStatsPromptActions,
  useAppUsageStatsPromptState,
} from './AppUsageStatsPromptContext';

type AppUsageStats = {
  optIn: () => void;
  optOut: () => void;
};

const AppUsageStatsContext = createContext<AppUsageStats | null>(null);

export const AppUsageStatsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const posthog = usePostHog();
  const {setOptedInStartedAt, clearOptedInStartedAt} =
    useAppUsageStatsPromptActions();

  const optInStartedAt = useAppUsageStatsPromptState(
    store => store.optInStartedAt,
  );

  const optIn = useCallback(() => {
    if (posthog.optedOut) {
      posthog.optIn();
      setOptedInStartedAt(Date.now());
    }
  }, [posthog, setOptedInStartedAt]);

  const optOut = useCallback(() => {
    if (!posthog.optedOut) {
      posthog.optOut();
      clearOptedInStartedAt();
    }
  }, [posthog, clearOptedInStartedAt]);

  useEffect(() => {
    if (!posthog.optedOut && optInStartedAt) {
      const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;

      if (Date.now() >= optInStartedAt + TWELVE_MONTHS_MS) {
        optOut();
      }
    }
  }, [posthog, optInStartedAt, optOut]);

  const value = useMemo(
    () => ({
      optIn,
      optOut,
    }),
    [optIn, optOut],
  );

  return (
    <AppUsageStatsContext.Provider value={value}>
      {children}
    </AppUsageStatsContext.Provider>
  );
};

export function useAppUsageStats() {
  const context = React.useContext(AppUsageStatsContext);
  if (!context) {
    throw new Error(
      'useAppUsageStats must be used within an AppUsageStatsProvider',
    );
  }
  return context;
}
