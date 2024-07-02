import type {Jsonifiable, ReadonlyDeep} from 'type-fest';

class SendMetricsHttpError extends Error {
  readonly status: number;
  readonly errorBody: string;
  constructor({
    status,
    errorBody,
  }: Readonly<{status: number; errorBody: string}>) {
    super(`HTTP error sending metrics. Error message: ${errorBody}`);
    this.status = status;
    this.errorBody = errorBody;
  }
}

/**
 * Send some metrics data to the metrics server.
 *
 * Throws if the request fails due to a network error (e.g., no connection) or
 * an HTTP error (e.g., a 403 status code).
 */
export async function sendMetricsData({
  isDevelopment,
  metricsUrl,
  metricsApiKey,
  dataToSend,
  signal,
}: ReadonlyDeep<{
  isDevelopment: boolean;
  metricsUrl: string;
  metricsApiKey: string;
  dataToSend: Jsonifiable;
  signal: AbortSignal;
}>): Promise<void> {
  if (isDevelopment) return;

  const response = await fetch(metricsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: metricsApiKey,
    },
    body: JSON.stringify({data: dataToSend}),
    credentials: 'omit',
    signal,
  });

  if (!response.ok) {
    throw new SendMetricsHttpError({
      status: response.status,
      errorBody: await response.text(),
    });
  }
}
