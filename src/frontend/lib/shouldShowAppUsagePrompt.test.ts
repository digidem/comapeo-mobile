import {shouldShowAppUsagePrompt} from './shouldShowAppUsagePrompt';
import type {AppUsageStatsPromptState} from '../contexts/AppUsageStatsPromptContext';

describe('shouldShowAppUsagePrompt', () => {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const THREE_MO = 90 * 24 * 60 * 60 * 1000;
  const NOW = 1_000_000;

  it('never shows if optedIn === true', () => {
    const state: AppUsageStatsPromptState = {
      completedOnboardingAt: NOW - ONE_WEEK - 1,
      lastPromptAt: NOW - THREE_MO - 1,
      promptCount: 5,
    };
    expect(shouldShowAppUsagePrompt(state, false)).toBe(false);
  });

  it('shows initial prompt once a week after onboarding, when promptCount===0', () => {
    const state: AppUsageStatsPromptState = {
      completedOnboardingAt: NOW - ONE_WEEK,
      lastPromptAt: null,
      promptCount: 0,
    };
    expect(shouldShowAppUsagePrompt(state, false)).toBe(true);
  });

  it('does not show initial prompt if not enough time passed', () => {
    const state: AppUsageStatsPromptState = {
      completedOnboardingAt: NOW - (ONE_WEEK - 1),
      lastPromptAt: null,
      promptCount: 0,
    };
    expect(shouldShowAppUsagePrompt(state, false)).toBe(false);
  });

  it('shows re-prompt up to 3 times, every 3 months', () => {
    for (let count = 1; count <= 3; count++) {
      const state: AppUsageStatsPromptState = {
        completedOnboardingAt: NOW - ONE_WEEK - 1,
        lastPromptAt: NOW - THREE_MO,
        promptCount: count,
      };
      expect(shouldShowAppUsagePrompt(state, false)).toBe(true);
    }
  });

  it('does not show re-prompt if promptCount > 3', () => {
    const state: AppUsageStatsPromptState = {
      completedOnboardingAt: NOW - ONE_WEEK - 1,
      lastPromptAt: NOW - THREE_MO,
      promptCount: 4,
    };
    expect(shouldShowAppUsagePrompt(state, false)).toBe(false);
  });

  it('does not show re-prompt if 3mo not passed yet', () => {
    const state: AppUsageStatsPromptState = {
      completedOnboardingAt: NOW - ONE_WEEK - 1,
      lastPromptAt: NOW - (THREE_MO - 1),
      promptCount: 2,
    };
    expect(shouldShowAppUsagePrompt(state, false)).toBe(false);
  });
});
