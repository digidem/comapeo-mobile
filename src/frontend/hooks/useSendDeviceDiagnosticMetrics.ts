import * as Sentry from '@sentry/react-native';
import {useEffect} from 'react';
import {generateDeviceDiagnosticMetricsData} from '../metrics/deviceDiagnosticMetrics';
import {getMetricsRequestInfo} from '../metrics/getMetricsRequestInfo';
import {sendMetricsData} from '../metrics/sendMetricsData';
import {usePersistedDeviceDiagnosticMetricsLastSentAt} from './persistedState/usePersistedDeviceDiagnosticMetricsLastSentAt';
import {usePersistedMetricsDeviceId} from './persistedState/usePersistedMetricsDeviceId';
import {useInternetMightBeReachable} from './useInternetMightBeReachable';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const SEND_DEVICE_DIAGNOSTICS_AT_MOST_EVERY_MS = ONE_DAY * 31;

function hasEnoughTimeElapsed(lastSentAt: null | number): boolean {
  if (lastSentAt == null) return true;

  const sendAfter = lastSentAt + SEND_DEVICE_DIAGNOSTICS_AT_MOST_EVERY_MS;
  const now = Date.now();
  return sendAfter < now;
}

export function useSendDeviceDiagnosticMetrics(): void {
  const metricsDeviceId = usePersistedMetricsDeviceId();
  const [lastSentAt, setLastSentAt] =
    usePersistedDeviceDiagnosticMetricsLastSentAt();
  const internetMightBeReachable = useInternetMightBeReachable();

  useEffect(() => {
    const shouldSendMetrics =
      internetMightBeReachable && hasEnoughTimeElapsed(lastSentAt);
    if (!shouldSendMetrics) return;

    const abortController = new AbortController();

    (async () => {
      try {
        const dataToSend = await generateDeviceDiagnosticMetricsData({
          metricsDeviceId,
        });
        if (abortController.signal.aborted) return;

        await sendMetricsData({
          ...getMetricsRequestInfo(),
          dataToSend,
          signal: abortController.signal,
        });

        setLastSentAt(Date.now());
      } catch (err) {
        if (abortController.signal.aborted) return;
        Sentry.captureException(err);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [internetMightBeReachable, lastSentAt, setLastSentAt, metricsDeviceId]);
}
