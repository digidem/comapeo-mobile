import {useMetrics} from '../contexts/MetricsContext';
import {createPersistedPermissionStore} from './persistedState/usePersistedPermission';

export const usePermissionToggle = () => {
  const {appMetrics, deviceMetrics} = useMetrics();

  const usePersistedPermission = createPersistedPermissionStore(
    appMetrics,
    deviceMetrics,
  );

  return usePersistedPermission();
};
