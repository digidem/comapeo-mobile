import React, {ReactNode} from 'react';
import {renderHook, act} from '@testing-library/react-native';
import {
  createAppUsageStatsStore,
  type AppUsageStatsStore,
  AppUsageStatsProvider,
  useAppUsageStatsState,
  useAppUsageStatsActions,
  AppUsageStatsState,
} from './AppUsageStatsContext';

function createWrapper(store: AppUsageStatsStore) {
  return ({children}: {children: ReactNode}) => (
    <AppUsageStatsProvider value={store}>{children}</AppUsageStatsProvider>
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

  it('initial state is correct', async () => {
    const store = createAppUsageStatsStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const {result} = await renderHook(() => useAppUsageStatsState(s => s), {
      wrapper,
    });
    expect(result.current).toStrictEqual({
      completedOnboardingAt: null,
      lastPromptAt: null,
      promptCount: 0,
      optInStartedAt: null,
    } as AppUsageStatsState);
  });

  it('records the completion of onboarding to current "now"', async () => {
    const store = createAppUsageStatsStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = await renderHook(() => useAppUsageStatsActions(), {
      wrapper,
    });
    const stateHook = await renderHook(
      () => useAppUsageStatsState(s => s.completedOnboardingAt),
      {wrapper},
    );

    await act(async () => {
      actionsHook.result.current.recordCompleteOnboarding();
    });
    expect(stateHook.result.current).toBe(FAKE_NOW);
  });

  it('setOptedIn(true) sets 12-month window fields, updates lastPromptAt, and does not bump promptCount', async () => {
    const store = createAppUsageStatsStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = await renderHook(() => useAppUsageStatsActions(), {
      wrapper,
    });
    const stateHook = await renderHook(() => useAppUsageStatsState(s => s), {
      wrapper,
    });

    await act(async () => {
      actionsHook.result.current.setOptedIn(true);
    });

    expect(stateHook.result.current).toMatchObject({
      lastPromptAt: FAKE_NOW,
      promptCount: 0,
      optInStartedAt: FAKE_NOW,
    });
  });

  it('setOptedIn(false) clears 12-month window fields, updates lastPromptAt, and bumps promptCount each time', async () => {
    const store = createAppUsageStatsStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = await renderHook(() => useAppUsageStatsActions(), {
      wrapper,
    });
    const stateHook = await renderHook(() => useAppUsageStatsState(s => s), {
      wrapper,
    });

    await act(async () => {
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current).toMatchObject({
      lastPromptAt: FAKE_NOW,
      promptCount: 1,
      optInStartedAt: null,
    });

    await act(async () => {
      jest.setSystemTime(FAKE_NOW + 1000);
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current.promptCount).toBe(2);
    expect(stateHook.result.current.optInStartedAt).toBeNull();
  });

  it('accepting after a decline keeps promptCount unchanged on accept but sets the 12-month window', async () => {
    const store = createAppUsageStatsStore({
      appUsageMetricsOptIn: () => {},
      appUsageMetricsOptOut: () => {},
    });
    const wrapper = createWrapper(store);
    const actionsHook = await renderHook(() => useAppUsageStatsActions(), {
      wrapper,
    });
    const stateHook = await renderHook(() => useAppUsageStatsState(s => s), {
      wrapper,
    });

    await act(async () => {
      actionsHook.result.current.setOptedIn(false);
    });
    expect(stateHook.result.current.promptCount).toBe(1);

    await act(async () => {
      jest.setSystemTime(FAKE_NOW + 2000);
      actionsHook.result.current.setOptedIn(true);
    });

    expect(stateHook.result.current.promptCount).toBe(1);
    expect(stateHook.result.current.optInStartedAt).toBe(FAKE_NOW + 2000);
    expect(stateHook.result.current.lastPromptAt).toBe(FAKE_NOW + 2000);
  });
});
