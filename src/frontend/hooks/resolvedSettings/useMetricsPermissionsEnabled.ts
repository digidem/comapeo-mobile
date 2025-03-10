import {
  type SettingsState,
  useSettingsState,
} from '../../contexts/SettingsStoreContext';

function selector(state: SettingsState): boolean {
  return state.metricsDiagnosticsPermissionsEnabled === null
    ? true
    : state.metricsDiagnosticsPermissionsEnabled;
}

/**
 * Resolves the based metrics permissions based on the settings. If the settings does not explicitly specify a value, falls back to `true`.
 */
export function useMetricsPermissionsEnabled(): boolean {
  return useSettingsState(selector);
}
