import type {ReadonlyDeep} from 'type-fest';
import {beginningOfMonthUtc, formatIsoUtc} from '../lib/date';
import {maxBy} from '../lib/maxBy';

export type AppDiagnosticMetricsReport = ReadonlyDeep<{
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

export function hasReportForToday({
  highWatermark,
  reports,
}: AppDiagnosticMetricsQueue): boolean {
  const today = formatIsoUtc(new Date());

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
  now: Readonly<Date>,
): AppDiagnosticMetricsQueue {
  const today = formatIsoUtc(now);
  const oldest = formatIsoUtc(beginningOfMonthUtc(now));
  return {
    ...queue,
    reports: queue.reports.filter(
      ({dateGenerated}) => dateGenerated >= oldest && dateGenerated <= today,
    ),
  };
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
