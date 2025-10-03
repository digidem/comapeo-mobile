import {useEffect} from 'react';
import {useAppUsageStatsState} from '../contexts/AppUsageStatsContext';
import {shouldShowAppUsagePrompt} from '../lib/shouldShowAppUsagePrompt';
import {useNavigationFromRoot} from './useNavigationWithTypes';

export const useShouldShowAppUsagePrompt = () => {
  const {completedOnboardingAt, lastPromptAt, promptCount, optInStartedAt} =
    useAppUsageStatsState(store => store);
  const {popTo} = useNavigationFromRoot();

  useEffect(() => {
    if (optInStartedAt) return;
    if (
      shouldShowAppUsagePrompt({
        completedOnboardingAt,
        lastPromptAt,
        promptCount,
      })
    ) {
      popTo('AppUsagePromptInterstitial');
    }
  }, [optInStartedAt, completedOnboardingAt, lastPromptAt, promptCount, popTo]);
};
