import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsActions,
} from '../../contexts/SettingsStoreContext';
import {useMetricsPermissionsEnabled} from './useMetricsPermissionsEnabled';

function createWrapper(settingsStore: SettingsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SettingsStoreProvider value={settingsStore}>
        {children}
      </SettingsStoreProvider>
    );
  };
}

test('has expected value based on settings state', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const settingsActionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const metricsPermissionsEnabledHook = renderHook(
    () => useMetricsPermissionsEnabled(),
    {wrapper},
  );

  // Initial state
  expect(metricsPermissionsEnabledHook.result.current).toBe(true);

  act(() => {
    settingsActionsHook.result.current.setMetricsDiagnosticsPermissions(false);
  });

  expect(metricsPermissionsEnabledHook.result.current).toBe(false);

  act(() => {
    settingsActionsHook.result.current.setMetricsDiagnosticsPermissions(true);
  });

  expect(metricsPermissionsEnabledHook.result.current).toBe(true);
});
