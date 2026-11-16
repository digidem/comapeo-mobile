import {dmsValuesAreValid, getParsedDmsValues} from './index';

describe('getParsedDmsValues()', () => {
  it('returns undefined when any parameter is not a parseable number', () => {
    expect(
      getParsedDmsValues({
        degrees: 'foo',
        minutes: '2',
        seconds: '3',
      }),
    ).toBe(undefined);

    expect(
      getParsedDmsValues({
        degrees: '1',
        minutes: 'bar',
        seconds: '3',
      }),
    ).toBe(undefined);

    expect(
      getParsedDmsValues({
        degrees: '1',
        minutes: '2',
        seconds: 'baz',
      }),
    ).toBe(undefined);
  });

  it('parses both integers and floats', () => {
    const expected = {
      degrees: 10.5,
      minutes: 10,
      seconds: -10,
    };

    expect(
      getParsedDmsValues({
        degrees: expected.degrees.toString(),
        minutes: expected.minutes.toString(),
        seconds: expected.seconds.toString(),
      }),
    ).toMatchObject(expected);
  });
});

describe('dmsValuesAreValid()', () => {
  const fields = ['lat', 'lon'] as const;

  it('handles parameters lacking parseable numbers', () => {
    for (const f of fields) {
      expect(
        dmsValuesAreValid(f, {
          degrees: 'foo',
          minutes: 'bar',
          seconds: 'baz',
        }),
      ).toBe(false);
    }
  });

  it('handles degress appropriately', () => {
    // lat - too high
    expect(
      dmsValuesAreValid('lat', {
        degrees: '91',
        minutes: '0',
        seconds: '0',
      }),
    ).toBe(false);

    // lat - negative
    expect(
      dmsValuesAreValid('lat', {
        degrees: '-1',
        minutes: '0',
        seconds: '0',
      }),
    ).toBe(false);

    // lon - too high
    expect(
      dmsValuesAreValid('lon', {
        degrees: '181',
        minutes: '0',
        seconds: '0',
      }),
    ).toBe(false);

    // lon - negative
    expect(
      dmsValuesAreValid('lon', {
        degrees: '-1',
        minutes: '0',
        seconds: '0',
      }),
    ).toBe(false);
  });

  it('handles minutes appropriately', () => {
    for (const f of fields) {
      // minutes valid
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '59',
          seconds: '0',
        }),
      ).toBe(true);

      // minutes too high
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '60',
          seconds: '0',
        }),
      ).toBe(false);

      // minutes negative
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '-1',
          seconds: '0',
        }),
      ).toBe(false);
    }
  });

  it('handles seconds appropriately', () => {
    for (const f of fields) {
      // valid seconds
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '0',
          seconds: '59',
        }),
      ).toBe(true);

      // seconds too high
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '0',
          seconds: '60',
        }),
      ).toBe(false);

      // minutes negative
      expect(
        dmsValuesAreValid(f, {
          degrees: '0',
          minutes: '0',
          seconds: '-1',
        }),
      ).toBe(false);
    }
  });
});
