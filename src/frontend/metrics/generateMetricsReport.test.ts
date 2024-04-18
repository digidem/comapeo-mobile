import generateMetricsReport from './generateMetricsReport';

describe('generateMetricsReport', () => {
  const defaultOptions: Parameters<typeof generateMetricsReport>[0] = {
    packageJson: {version: '1.2.3'},
    os: 'android',
    osVersion: 123,
    screen: {width: 12, height: 34},
    observations: [
      // Middle of the Atlantic
      {lat: 10, lon: -33},
      // Mexico City
      {lat: 19.419914, lon: -99.088059},
      // Machias Seal Island, disputed territory
      {lat: 44.5, lon: -67.101111},
      // To be ignored
      {},
      {lat: 12},
      {lon: 34},
    ],
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

  it('includes screen dimensions', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.screen).toEqual({width: 12, height: 34});
  });

  it("doesn't include countries if no observations are provided", () => {
    const options = {...defaultOptions, observations: []};
    const report = generateMetricsReport(options);
    expect(report.countries).toBe(undefined);
  });

  it('includes countries where observations are found', () => {
    const report = generateMetricsReport(defaultOptions);
    expect(report.countries).toHaveLength(new Set(report.countries).size);
    expect(new Set(report.countries)).toEqual(new Set(['MEX', 'CAN', 'USA']));
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
