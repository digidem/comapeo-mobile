import {assert} from '../lib/assert';

const getEnv = (name: string): string => {
  const result = process.env[name];
  assert(result, `${name} environment variable should be set`);
  return result;
};

/**
 * Get the info to send a metrics request.
 *
 * We could set all of these at the top level, but if we do that and you forget
 * to set the environment variables, the app won't start.
 *
 * @see {sendMetricsData}
 */
export const getMetricsRequestInfo = () => ({
  isDevelopment: __DEV__,
  metricsUrl: getEnv('EXPO_PUBLIC_METRICS_URL'),
  metricsApiKey: getEnv('EXPO_PUBLIC_METRICS_API_KEY'),
});
