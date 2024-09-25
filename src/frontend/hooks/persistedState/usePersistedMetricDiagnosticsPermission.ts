import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type MetricDiagnosticsPermissionSlice = {
  isEnabled: boolean;
  setIsEnabled: (isEnabled: boolean) => void;
};

const metricDiagnosticsPermissionSlice: StateCreator<
  MetricDiagnosticsPermissionSlice
> = set => ({
  isEnabled: true,
  setIsEnabled: isEnabled => set({isEnabled}),
});

export const usePersistedMetricDiagnosticsPermission = createPersistedState(
  metricDiagnosticsPermissionSlice,
  'MetricDiagnosticsPermission',
);
