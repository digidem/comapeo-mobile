import {createPersistedState} from './createPersistedState';
import {AppDiagnosticMetrics} from '../../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../../metrics/DeviceDiagnosticMetrics';

interface PermissionState {
  isPermissionEnabled: boolean;
  togglePermission: () => void;
  appDiagnosticMetrics: AppDiagnosticMetrics;
  deviceDiagnosticMetrics: DeviceDiagnosticMetrics;
}

export const usePersistedPermission = createPersistedState<PermissionState>(
  set => {
    const appDiagnosticMetrics = new AppDiagnosticMetrics();
    const deviceDiagnosticMetrics = new DeviceDiagnosticMetrics();

    return {
      isPermissionEnabled: false,
      togglePermission: () => {
        set(state => {
          const newValue = !state.isPermissionEnabled;
          appDiagnosticMetrics.setEnabled(newValue);
          deviceDiagnosticMetrics.setEnabled(newValue);
          return {isPermissionEnabled: newValue};
        });
      },
      appDiagnosticMetrics,
      deviceDiagnosticMetrics,
    };
  },
  'Permissions',
);
