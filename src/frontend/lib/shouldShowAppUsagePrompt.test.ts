import {shouldShowAppUsagePrompt} from './shouldShowAppUsagePrompt';
import type {AppUsageStatsState} from '../contexts/AppUsageStatsContext';

describe('shouldShowAppUsagePrompt', () => {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const THREE_MO = 90 * 24 * 60 * 60 * 1000;

  it('shows initial prompt once a week after onboarding, when promptCount===0', () => {
    const state: AppUsageStatsState = {
      completedOnboardingAt: Date.now() - ONE_WEEK,
      lastPromptAt: null,
      promptCount: 0,
    };
    expect(shouldShowAppUsagePrompt(state)).toBe(true);
  });

  it('does not show initial prompt if not enough time passed', () => {
    const state: AppUsageStatsState = {
      completedOnboardingAt: Date.now() - ONE_WEEK + 1000,
      lastPromptAt: null,
      promptCount: 0,
    };
    expect(shouldShowAppUsagePrompt(state)).toBe(false);
  });

  it('shows re-prompt up to 3 times, every 3 months', () => {
    for (let count = 1; count < 3; count++) {
      const state: AppUsageStatsState = {
        completedOnboardingAt: Date.now() - ONE_WEEK - 1,
        lastPromptAt: Date.now() - THREE_MO,
        promptCount: count,
      };
      expect(shouldShowAppUsagePrompt(state)).toBe(true);
    }
  });

  it('does not show re-prompt if promptCount > 3', () => {
    const state: AppUsageStatsState = {
      completedOnboardingAt: Date.now() - ONE_WEEK - 1,
      lastPromptAt: Date.now() - THREE_MO,
      promptCount: 4,
    };
    expect(shouldShowAppUsagePrompt(state)).toBe(false);
  });

  it('does not show re-prompt if 3mo not passed yet', () => {
    const state: AppUsageStatsState = {
      completedOnboardingAt: Date.now() - ONE_WEEK - 1,
      lastPromptAt: Date.now() - (THREE_MO - 1),
      promptCount: 2,
    };
    expect(shouldShowAppUsagePrompt(state)).toBe(false);
  });
});
