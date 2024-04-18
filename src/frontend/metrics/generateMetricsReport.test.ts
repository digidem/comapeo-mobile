import generateMetricsReport from './generateMetricsReport';

describe('generateMetricsReport', () => {
  const defaultOptions: Parameters<typeof generateMetricsReport>[0] = {
    packageJson: {version: '1.2.3'},
  };

  it('can be serialized and deserialized as JSON', () => {
    const report = generateMetricsReport(defaultOptions);
    const actual = JSON.parse(JSON.stringify(report));
    const expected = removeUndefinedEntries(report);
    expect(actual).toEqual(expected);
  });

  it('includes a report type', () => {
    expect(generateMetricsReport(defaultOptions).type).toBe('metrics-v1');
  });

  it('includes the app version', () => {
    expect(generateMetricsReport(defaultOptions).appVersion).toBe('1.2.3');
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
