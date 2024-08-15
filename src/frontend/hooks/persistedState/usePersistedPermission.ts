import {createPersistedState} from './createPersistedState';
import {AppDiagnosticMetrics} from '../../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../../metrics/DeviceDiagnosticMetrics';

interface PermissionState {
  isPermissionEnabled: boolean;
  togglePermission: () => void;
}

export const createPersistedPermissionStore = (
  appDiagnosticMetrics: AppDiagnosticMetrics,
  deviceDiagnosticMetrics: DeviceDiagnosticMetrics,
) => {
  return createPersistedState<PermissionState>(
    set => ({
      isPermissionEnabled: false,
      togglePermission: () => {
        set(state => {
          const newValue = !state.isPermissionEnabled;
          appDiagnosticMetrics.setEnabled(newValue);
          deviceDiagnosticMetrics.setEnabled(newValue);
          return {isPermissionEnabled: newValue};
        });
      },
    }),
    'Permissions',
  );
};
