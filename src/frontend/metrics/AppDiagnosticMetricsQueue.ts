import type {ReadonlyDeep} from 'type-fest';
import {formatIsoUtc, subDays} from '../lib/date';
import {mapGroupBy} from '../lib/mapGroupBy';
import {maxBy} from '../lib/maxBy';

const MAX_REPORT_AGE_DAYS = 30;

type AppDiagnosticMetricsRequestData = ReadonlyDeep<{
  type: 'app diagnostics v1';
  reports: AppDiagnosticMetricsReport[];
}>;

export type AppDiagnosticMetricsReport = ReadonlyDeep<{
  monthlyDeviceHash: string;
  dateGenerated: string;
  os: string;
  osVersion: string | number;
  appId?: string;
  appName?: string;
  nativeApplicationVersion?: string;
  nativeBuildVersion?: string;
  country?: string;
  deviceLocale: string;
  appLocale: string;
}>;

export type AppDiagnosticMetricsQueue = ReadonlyDeep<{
  /** An ISO date, such as `2012-03-04`, for the newest report successfully sent. */
  highWatermark?: string;
  reports: AppDiagnosticMetricsReport[];
}>;

const todayUtc = () => formatIsoUtc(new Date());

export function hasReportForToday({
  highWatermark,
  reports,
}: AppDiagnosticMetricsQueue): boolean {
  const today = todayUtc();

  const hasAlreadySentForToday = !!highWatermark && highWatermark >= today;
  if (hasAlreadySentForToday) return true;

  // The "or future" part could happen if the user changes their device clock to
  // the past.
  const hasReportForTodayOrFuture = reports.some(
    report => report.dateGenerated >= today,
  );
  if (hasReportForTodayOrFuture) return true;

  return false;
}

export function truncateReportsByTime(
  queue: AppDiagnosticMetricsQueue,
): AppDiagnosticMetricsQueue {
  const today = todayUtc();
  const oldest = formatIsoUtc(subDays(new Date(), MAX_REPORT_AGE_DAYS));

  return {
    ...queue,
    reports: queue.reports.filter(({dateGenerated}) => {
      const isTooOld = dateGenerated < oldest;
      if (isTooOld) return false;

      const isTooNew = dateGenerated > today;
      if (isTooNew) return false;

      return true;
    }),
  };
}

export function getRequestDatas(
  queue: Readonly<AppDiagnosticMetricsQueue>,
): AppDiagnosticMetricsRequestData[] {
  const grouped = mapGroupBy(queue.reports, report => report.monthlyDeviceHash);

  const result: AppDiagnosticMetricsRequestData[] = [];
  for (const group of grouped.values()) {
    result.push({
      type: 'app diagnostics v1',
      reports: group,
    });
  }

  return result;
}

export function updateQueueHighWatermark(
  queue: Readonly<AppDiagnosticMetricsQueue>,
): AppDiagnosticMetricsQueue {
  const newestReport = maxBy(queue.reports, report => report.dateGenerated);
  const highWatermark =
    newestReport?.dateGenerated ||
    queue.highWatermark ||
    formatIsoUtc(new Date());
  return {highWatermark, reports: []};
}
