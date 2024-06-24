import {positionToCountries} from './positionToCountries';

describe('positionToCountries', () => {
  it('returns nothing for invalid values', () => {
    expect(positionToCountries(-91, 181)).toEqual(new Set());
    expect(positionToCountries(Infinity, -Infinity)).toEqual(new Set());
    expect(positionToCountries(NaN, NaN)).toEqual(new Set());
  });

  it('returns nothing for the middle of the Atlantic ocean', () => {
    expect(positionToCountries(10, -33)).toEqual(new Set());
  });

  it('returns Mexico for a point in Mexico City', () => {
    expect(positionToCountries(19.419914, -99.088059)).toEqual(
      new Set(['MEX']),
    );
  });

  it('returns multiple countries for disputed territories', () => {
    // [Machias Seal Island][0] is a disputed territory.
    // [0]: https://en.wikipedia.org/wiki/Machias_Seal_Island
    expect(positionToCountries(44.5, -67.101111)).toEqual(
      new Set(['CAN', 'USA']),
    );
  });
});
