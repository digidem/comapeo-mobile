import generateMetricsReport from './generateMetricsReport';

describe('generateMetricsReport', () => {
  const defaultOptions: Parameters<typeof generateMetricsReport>[0] = {
    packageJson: {version: '1.2.3'},
    os: 'android',
    osVersion: 123,
  };

  it('can be serialized and deserialized as JSON', () => {
    const report = generateMetricsReport(defaultOptions);
    const actual = JSON.parse(JSON.stringify(report));
    const expected = removeUndefinedEntries(report);
    expect(actual).toEqual(expected);
  });

  it('includes a report type', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.type).toBe('metrics-v1');
  });

  it('includes the app version', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.appVersion).toBe('1.2.3');
  });

  it('includes the OS (Android style)', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.os).toBe('android');
    expect(report.osVersion).toBe(123);
  });

  it('includes the OS (iOS style)', () => {
    const options = {...defaultOptions, os: 'ios', osVersion: '1.2.3'};
    const report = generateMetricsReport(options);
    expect(report.os).toBe('ios');
    expect(report.osVersion).toBe('1.2.3');
  });

  it('includes the OS (desktop style)', () => {
    const options = {...defaultOptions, os: 'win32', osVersion: '1.2.3'};
    const report = generateMetricsReport(options);
    expect(report.os).toBe('win32');
    expect(report.osVersion).toBe('1.2.3');
  });
});

function removeUndefinedEntries(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const definedEntries = Object.entries(obj).filter(
    entry => entry[1] !== undefined,
  );
  return Object.fromEntries(definedEntries);
}
