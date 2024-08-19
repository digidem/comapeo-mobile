import {usePersistedMetricDiagnosticsPermission} from './persistedState/usePersistedMetricDiagnosticsPermission';

export const useMetricsDiagnosticsPermissionsToggle = () => {
  const {isEnabled, setIsEnabled} = usePersistedMetricDiagnosticsPermission();

  const togglePermission = () => setIsEnabled(!isEnabled);

  return {isPermissionEnabled: isEnabled, togglePermission};
};
