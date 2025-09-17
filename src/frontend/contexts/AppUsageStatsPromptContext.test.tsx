import React, {ReactNode} from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {
  createAppUsageStatsPromptStore,
  type AppUsageStatsPromptStore,
  AppUsageStatsPromptProvider,
  useAppUsageStatsPromptState,
  useAppUsageStatsPromptActions,
  AppUsageStatsPromptState,
} from './AppUsageStatsPromptContext';

function createWrapper(store: AppUsageStatsPromptStore) {
  return ({children}: {children: ReactNode}) => (
    <AppUsageStatsPromptProvider value={store}>
      {children}
    </AppUsageStatsPromptProvider>
  );
}

describe('AppUsageStatsPromptContext', () => {
  const FAKE_NOW = 1_000_000;

  beforeAll(() => {
    jest.useFakeTimers({legacyFakeTimers: false});
  });

  beforeEach(() => {
    jest.setSystemTime(FAKE_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('initial state is correct', () => {
    const store = createAppUsageStatsPromptStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const {result} = renderHook(() => useAppUsageStatsPromptState(s => s), {
      wrapper,
    });
    expect(result.current).toStrictEqual({
      optedIn: null,
      completedOnboardingAt: null,
      lastPromptAt: null,
      promptCount: 0,
      optInStartedAt: null,
    } as AppUsageStatsPromptState);
  });

  it('records the completion of onboarding exactly once', () => {
    const store = createAppUsageStatsPromptStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = renderHook(() => useAppUsageStatsPromptActions(), {
      wrapper,
    });
    const stateHook = renderHook(
      () => useAppUsageStatsPromptState(s => s.completedOnboardingAt),
      {wrapper},
    );

    act(() => {
      actionsHook.result.current.recordCompleteOnboarding();
    });
    expect(stateHook.result.current).toBe(FAKE_NOW);

    act(() => {
      jest.setSystemTime(FAKE_NOW + 500);
      actionsHook.result.current.recordCompleteOnboarding();
    });
    expect(stateHook.result.current).toBe(FAKE_NOW);
  });

  it('setOptedIn(true) sets 12-month window fields, updates lastPromptAt, and does not bump promptCount', () => {
    const store = createAppUsageStatsPromptStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = renderHook(() => useAppUsageStatsPromptActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useAppUsageStatsPromptState(s => s), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setOptedIn(true);
    });

    expect(stateHook.result.current).toMatchObject({
      optedIn: true,
      lastPromptAt: FAKE_NOW,
      promptCount: 0,
      optInStartedAt: FAKE_NOW,
    });
  });

  it('setOptedIn(false) clears 12-month window fields, updates lastPromptAt, and bumps promptCount each time', () => {
    const store = createAppUsageStatsPromptStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = renderHook(() => useAppUsageStatsPromptActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useAppUsageStatsPromptState(s => s), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current).toMatchObject({
      optedIn: false,
      lastPromptAt: FAKE_NOW,
      promptCount: 1,
      optInStartedAt: null,
    });

    act(() => {
      jest.setSystemTime(FAKE_NOW + 1000);
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current.promptCount).toBe(2);
    expect(stateHook.result.current.optInStartedAt).toBeNull();
  });

  it('accepting after a decline keeps promptCount unchanged on accept but sets the 12-month window', () => {
    const store = createAppUsageStatsPromptStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = renderHook(() => useAppUsageStatsPromptActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useAppUsageStatsPromptState(s => s), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current.promptCount).toBe(1);

    act(() => {
      jest.setSystemTime(FAKE_NOW + 2000);
      actionsHook.result.current.setOptedIn(true);
    });

    expect(stateHook.result.current.promptCount).toBe(1);
    expect(stateHook.result.current.optInStartedAt).toBe(FAKE_NOW + 2000);
    expect(stateHook.result.current.lastPromptAt).toBe(FAKE_NOW + 2000);
  });
});
