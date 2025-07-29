import type {AppUsageStatsPromptState} from '../contexts/AppUsageStatsPromptContext';

export function shouldShowAppUsagePrompt(
  state: AppUsageStatsPromptState,
  now: number = Date.now(),
) {
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const threeMonths = 90 * 24 * 60 * 60 * 1000;

  const shouldShowInitialPrompt =
    !!state.completedOnboardingAt &&
    now - state.completedOnboardingAt >= oneWeek &&
    state.promptCount === 0;

  const shouldRePrompt =
    state.promptCount > 0 &&
    state.promptCount <= 3 &&
    now - (state.lastPromptAt || 0) >= threeMonths;

  return shouldShowInitialPrompt || shouldRePrompt;
}
