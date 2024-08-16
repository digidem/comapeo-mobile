import * as React from 'react';
import {AppDiagnosticMetrics} from '../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../metrics/DeviceDiagnosticMetrics';
import {usePersistedMetricDiagnosticsPermission} from '../hooks/persistedState/usePersistedMetricDiagnosticsPermission';

export type MetricsContextType = {
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
};

const MetricsContext = React.createContext<MetricsContextType | undefined>(
  undefined,
);

export type MetricsProviderProps = {
  children?: React.ReactNode;
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
};

export const MetricsProvider = ({
  children,
  appMetrics,
  deviceMetrics,
}: MetricsProviderProps): JSX.Element => {
  const {isEnabled} = usePersistedMetricDiagnosticsPermission();

  React.useEffect(() => {
    appMetrics.setEnabled(isEnabled);
    deviceMetrics.setEnabled(isEnabled);
  }, [appMetrics, deviceMetrics, isEnabled]);

  return (
    <MetricsContext.Provider value={{appMetrics, deviceMetrics}}>
      {children}
    </MetricsContext.Provider>
  );
};

export function useMetrics() {
  const context = React.useContext(MetricsContext);
  if (!context) {
    throw new Error('MetricsContext must be used within a MetricsProvider');
  }
  return context;
}
