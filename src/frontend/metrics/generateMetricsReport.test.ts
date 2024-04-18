import generateMetricsReport from './generateMetricsReport';

describe('generateMetricsReport', () => {
  it('can be serialized and deserialized as JSON', () => {
    const report = generateMetricsReport();
    const actual = JSON.parse(JSON.stringify(report));
    const expected = removeUndefinedEntries(report);
    expect(actual).toEqual(expected);
  });

  it('includes a report type', () => {
    expect(generateMetricsReport().type).toBe('metrics-v1');
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
