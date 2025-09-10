import {
  useAppUsageStatsPromptActions,
  useAppUsageStatsPromptStore,
} from '../contexts/AppUsageStatsPromptContext';

export function useShouldShowAppUsagePrompt(deviceName: string | undefined) {
  const {optedIn, completedOnboardingAt, lastPromptAt, promptCount} =
    useAppUsageStatsPromptStore().instance.getState();

  const {recordCompleteOnboarding} = useAppUsageStatsPromptActions();

  if (deviceName && completedOnboardingAt === null) {
    recordCompleteOnboarding();
    return false;
  }

  if (optedIn === true) {
    return false;
  }

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const threeMonths = 90 * 24 * 60 * 60 * 1000;

  const shouldShowInitialPrompt =
    !!completedOnboardingAt &&
    now - completedOnboardingAt >= oneWeek &&
    promptCount === 0;

  const shouldRePrompt =
    promptCount > 0 &&
    promptCount <= 3 &&
    now - (lastPromptAt || 0) >= threeMonths;

  return shouldShowInitialPrompt || shouldRePrompt;
}
