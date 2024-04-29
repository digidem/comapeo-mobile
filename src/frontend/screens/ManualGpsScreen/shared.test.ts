import {
  getInitialCardinality,
  latitudeIsValid,
  longitudeIsValid,
  parseNumber,
} from './shared';

describe('parseNumber()', () => {
  it('returns undefined when no float to parse', () => {
    const fixtures = ['', 'abc', 'abc123'];

    for (const f of fixtures) {
      expect(parseNumber(f)).toBe(undefined);
    }
  });
});

describe('getInitialCardinality()', () => {
  it('handles lat', () => {
    expect(getInitialCardinality('lat', {lat: undefined, lon: 0})).toBe('N');
    expect(getInitialCardinality('lat', {lat: 0, lon: 0})).toBe('N');
    expect(getInitialCardinality('lat', {lat: -1, lon: 0})).toBe('S');
    expect(getInitialCardinality('lat', {lat: 1, lon: 0})).toBe('N');
  });

  it('handles lon', () => {
    expect(getInitialCardinality('lon', {lat: 0, lon: undefined})).toBe('E');
    expect(getInitialCardinality('lon', {lat: 0, lon: 0})).toBe('E');
    expect(getInitialCardinality('lon', {lat: 0, lon: 1})).toBe('E');
    expect(getInitialCardinality('lon', {lat: 0, lon: -1})).toBe('W');
  });
});

describe('longitudeIsValid()', () => {
  it('returns true for valid values', () => {
    expect(longitudeIsValid(180)).toBe(true);
    expect(longitudeIsValid(-180)).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(longitudeIsValid(181)).toBe(false);
    expect(longitudeIsValid(-181)).toBe(false);
  });
});

describe('latitudeIsValid()', () => {
  it('returns true for valid values', () => {
    expect(latitudeIsValid(90)).toBe(true);
    expect(latitudeIsValid(-90)).toBe(true);
  });

  it('returns false for invalid values', () => {
    expect(latitudeIsValid(91)).toBe(false);
    expect(latitudeIsValid(-91)).toBe(false);
  });
});
