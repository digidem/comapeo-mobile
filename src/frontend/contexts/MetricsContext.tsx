import * as React from 'react';
import {AppDiagnosticMetrics} from '../metrics/AppDiagnosticMetrics';
import {DeviceDiagnosticMetrics} from '../metrics/DeviceDiagnosticMetrics';
import {useMetricsPermissionsEnabled} from '../hooks/resolvedSettings/useMetricsPermissionsEnabled';

export type MetricsContextType = {
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
};

const MetricsContext = React.createContext<MetricsContextType | undefined>(
  undefined,
);

export const MetricsProvider = ({
  children,
  appMetrics,
  deviceMetrics,
}: {
  children: React.ReactNode;
  appMetrics: AppDiagnosticMetrics;
  deviceMetrics: DeviceDiagnosticMetrics;
}) => {
  const isEnabled = useMetricsPermissionsEnabled();

  React.useEffect(() => {
    appMetrics.setEnabled(isEnabled);
    deviceMetrics.setEnabled(isEnabled);
  }, [isEnabled, appMetrics, deviceMetrics]);

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
