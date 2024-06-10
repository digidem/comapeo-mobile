import type {Jsonifiable, ReadonlyDeep} from 'type-fest';

class SendMetricsReportHttpError extends Error {
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
 * Send a metrics report to the metrics server.
 *
 * Throws if the request fails due to a network error (e.g., no connection) or
 * an HTTP error (e.g., a 403 status code).
 */
export async function sendMetricsReport({
  metricsUrl,
  metricsApiKey,
  metricsReport,
  signal,
}: ReadonlyDeep<{
  metricsUrl: string;
  metricsApiKey: string;
  metricsReport: Jsonifiable;
  signal: AbortSignal;
}>): Promise<void> {
  const body = new Blob([JSON.stringify({data: metricsReport})]);

  const response = await fetch(metricsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.size.toString(),
      Authorization: metricsApiKey,
    },
    body,
    credentials: 'omit',
    signal,
  });

  if (!response.ok) {
    throw new SendMetricsReportHttpError({
      status: response.status,
      errorBody: await response.text(),
    });
  }
}
