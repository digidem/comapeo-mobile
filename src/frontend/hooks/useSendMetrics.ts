import {useSendDeviceDiagnosticMetrics} from './useSendDeviceDiagnosticMetrics';

export function useSendMetrics(): void {
  // TODO: Send other metrics.
  // See <https://github.com/digidem/comapeo-mobile/issues/460>.
  useSendDeviceDiagnosticMetrics();
}
