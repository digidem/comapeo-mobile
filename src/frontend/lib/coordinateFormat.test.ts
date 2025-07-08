import {is} from 'valibot';

import {CoordinateFormatSchema, convertToUTM} from './coordinateFormat';

describe('CoordinateFormatSchema', () => {
  test('captures valid values', () => {
    expect(is(CoordinateFormatSchema, 'dms')).toBe(true);
    expect(is(CoordinateFormatSchema, 'dd')).toBe(true);
    expect(is(CoordinateFormatSchema, 'utm')).toBe(true);
  });

  test('denies invalid values', () => {
    expect(is(CoordinateFormatSchema, '')).toBe(false);
    expect(is(CoordinateFormatSchema, 0)).toBe(false);
    expect(is(CoordinateFormatSchema, null)).toBe(false);
    expect(is(CoordinateFormatSchema, undefined)).toBe(false);
    expect(is(CoordinateFormatSchema, {})).toBe(false);
    expect(is(CoordinateFormatSchema, [])).toBe(false);
  });
});

describe('convertToUTM()', () => {
  it('converts latitude + longitude to UTM format', () => {
    expect(convertToUTM({lat: 12, lon: -34})).toBe('UTM 25P 391136 1326751');
  });
});
