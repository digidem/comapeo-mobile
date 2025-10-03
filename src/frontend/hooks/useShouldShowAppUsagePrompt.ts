import {useEffect} from 'react';
import {useAppUsageStatsState} from '../contexts/AppUsageStatsContext';
import {shouldShowAppUsagePrompt} from '../lib/shouldShowAppUsagePrompt';
import {useNavigationFromRoot} from './useNavigationWithTypes';

export const useShouldShowAppUsagePrompt = () => {
  const {completedOnboardingAt, lastPromptAt, promptCount, optInStartedAt} =
    useAppUsageStatsState(store => store);
  const {navigate} = useNavigationFromRoot();

  useEffect(() => {
    if (optInStartedAt) return;
    if (
      shouldShowAppUsagePrompt({
        completedOnboardingAt,
        lastPromptAt,
        promptCount,
      })
    ) {
      navigate('AppUsagePromptInterstitial');
    }
  }, [
    optInStartedAt,
    completedOnboardingAt,
    lastPromptAt,
    promptCount,
    navigate,
  ]);
};
