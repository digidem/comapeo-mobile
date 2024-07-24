import {addDays, subDays} from 'date-fns';
import {formatIsoUtc} from '../lib/date';
import {
  type AppDiagnosticMetricsReport,
  hasReportForToday,
  truncateReportsByTime,
  updateQueueHighWatermark,
} from './AppDiagnosticMetricsQueue';

const today = formatIsoUtc(new Date());
const tomorrow = formatIsoUtc(addDays(new Date(), 1));
const yesterday = formatIsoUtc(subDays(new Date(), 1));

const report = (
  overrides: Partial<AppDiagnosticMetricsReport>,
): AppDiagnosticMetricsReport => ({
  dateGenerated: today,
  os: 'test',
  osVersion: 123,
  deviceLocale: 'en-US',
  appLocale: 'es-MX',
  ...overrides,
});

describe('hasReportForToday', () => {
  it('returns true if the high watermark is today', () => {
    const queue = {highWatermark: today, reports: []};
    expect(hasReportForToday(queue)).toBe(true);
  });

  it('returns true if the high watermark is in the future (possible if the user changes their device clock)', () => {
    const queue = {highWatermark: tomorrow, reports: []};
    expect(hasReportForToday(queue)).toBe(true);
  });

  it("returns true if there's a report for today", () => {
    const queue = {reports: [report({dateGenerated: today})]};
    expect(hasReportForToday(queue)).toBe(true);
  });

  it("returns true if there's a report for in the future (possible if the user changes their device clock)", () => {
    const queue = {reports: [report({dateGenerated: tomorrow})]};
    expect(hasReportForToday(queue)).toBe(true);
  });

  it('returns false if there is no high watermark nor report for today', () => {
    const queue = {reports: [report({dateGenerated: yesterday})]};
    expect(hasReportForToday(queue)).toBe(false);
  });

  it("returns false if the high watermark is in the past and there's no report for today", () => {
    const queue = {
      highWatermark: yesterday,
      reports: [report({dateGenerated: yesterday})],
    };
    expect(hasReportForToday(queue)).toBe(false);
  });
});

describe('truncateReportsByTime', () => {
  it('does nothing to an empty queue', () => {
    const queue = {highWatermark: today, reports: []};
    expect(truncateReportsByTime(queue, new Date())).toEqual(queue);
  });

  it('removes reports from last month and reports from the future', () => {
    const now = new Date(Date.UTC(2020, 3, 20));
    const queue = {
      reports: [
        report({dateGenerated: '2020-01-20'}),
        report({dateGenerated: '2020-02-20'}),
        report({dateGenerated: '2020-03-31'}),
        report({dateGenerated: '2020-04-01'}),
        report({dateGenerated: '2020-04-19'}),
        report({dateGenerated: '2020-04-20'}),
        report({dateGenerated: '2020-04-21'}),
      ],
    };
    expect(truncateReportsByTime(queue, now)).toEqual({
      reports: [
        report({dateGenerated: '2020-04-01'}),
        report({dateGenerated: '2020-04-19'}),
        report({dateGenerated: '2020-04-20'}),
      ],
    });
  });
});

describe('updateQueueHighWatermark', () => {
  it("updates the high watermark to today if there's nothing else to go on", () => {
    const queue = {reports: []};
    expect(updateQueueHighWatermark(queue)).toEqual({
      highWatermark: today,
      reports: [],
    });
  });

  it('maintains the high watermark if no reports are included', () => {
    const queue = {highWatermark: tomorrow, reports: []};
    expect(updateQueueHighWatermark(queue)).toEqual({
      highWatermark: tomorrow,
      reports: [],
    });
  });

  it('sets the high watermark to the oldest metrics report and clears pending ones', () => {
    const queue = {
      highWatermark: yesterday,
      reports: [report({dateGenerated: today})],
    };
    expect(updateQueueHighWatermark(queue)).toEqual({
      highWatermark: today,
      reports: [],
    });
  });
});
