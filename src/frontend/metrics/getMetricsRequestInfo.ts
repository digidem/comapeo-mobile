import {assert} from '../lib/assert';

/**
 * Get the info to send a metrics request.
 *
 * We could set all of these at the top level, but if we do that and you forget
 * to set the environment variables, the app won't start.
 *
 * @see {sendMetricsData}
 */
export function getMetricsRequestInfo(): {
  isDevelopment: boolean;
  metricsUrl: string;
  metricsApiKey: string;
} {
  const isDevelopment = __DEV__;
  const metricsUrl = process.env.EXPO_PUBLIC_METRICS_URL;
  const metricsApiKey = process.env.EXPO_PUBLIC_METRICS_API_KEY;

  assert(
    metricsUrl,
    'EXPO_PUBLICS_METRICS_URL environment variable should be set',
  );
  assert(
    metricsApiKey,
    'EXPO_PUBLICS_METRICS_API_KEY environment variable should be set',
  );

  return {isDevelopment, metricsUrl, metricsApiKey};
}
