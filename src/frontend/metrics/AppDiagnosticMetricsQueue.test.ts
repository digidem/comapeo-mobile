import {addDays, subDays} from 'date-fns';
import {formatIsoUtc} from '../lib/date';
import {
  type AppDiagnosticMetricsReport,
  getRequestDatas,
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
  monthlyDeviceHash: 'abc123',
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
    expect(truncateReportsByTime(queue)).toEqual(queue);
  });

  it('removes reports >30 days old and reports from the future', () => {
    const now = new Date();
    const queue = {
      reports: [
        report({dateGenerated: formatIsoUtc(subDays(now, 31))}),
        report({dateGenerated: formatIsoUtc(subDays(now, 30))}),
        report({dateGenerated: yesterday}),
        report({dateGenerated: today}),
        report({dateGenerated: tomorrow}),
      ],
    };
    expect(truncateReportsByTime(queue)).toEqual({
      reports: [
        report({dateGenerated: formatIsoUtc(subDays(now, 30))}),
        report({dateGenerated: yesterday}),
        report({dateGenerated: today}),
      ],
    });
  });
});

describe('getRequestDatas', () => {
  it('returns an empty array if passed no reports', () => {
    const queue = {reports: []};
    expect(getRequestDatas(queue)).toEqual([]);
  });

  it("doesn't split if there's just one report", () => {
    const queue = {
      reports: [
        report({dateGenerated: yesterday}),
        report({dateGenerated: today}),
      ],
    };
    expect(getRequestDatas(queue)).toEqual([
      {
        type: 'app diagnostics v1',
        reports: [
          report({dateGenerated: yesterday}),
          report({dateGenerated: today}),
        ],
      },
    ]);
  });

  it('splits reports by monthly device hash', () => {
    const queue = {
      reports: [
        report({monthlyDeviceHash: 'foo', dateGenerated: yesterday}),
        report({monthlyDeviceHash: 'foo', dateGenerated: today}),
        report({monthlyDeviceHash: 'bar', dateGenerated: tomorrow}),
      ],
    };
    expect(getRequestDatas(queue)).toEqual([
      {
        type: 'app diagnostics v1',
        reports: [
          report({monthlyDeviceHash: 'foo', dateGenerated: yesterday}),
          report({monthlyDeviceHash: 'foo', dateGenerated: today}),
        ],
      },
      {
        type: 'app diagnostics v1',
        reports: [report({monthlyDeviceHash: 'bar', dateGenerated: tomorrow})],
      },
    ]);
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
