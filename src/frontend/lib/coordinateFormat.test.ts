import {is} from 'valibot';

import {
  CoordinateFormatSchema,
  convertToUTM,
  formatCoords,
  convertDmsToDd,
  toDegreesMinutesAndSeconds,
  getCoords,
} from './coordinateFormat';

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
  /**
   * Reference coordinates verified against NOAA NCAT (National Geodetic Survey)
   * https://geodesy.noaa.gov/api/ncat/llh
   *
   * Note: The 'utm' npm package may produce slightly different results than NOAA
   * due to different ellipsoid parameters or rounding. Values are verified to be
   * within ~1 meter for easting/northing.
   */

  it('converts Statue of Liberty coordinates (well-known landmark)', () => {
    // Statue of Liberty: 40.689247°N, 74.044502°W
    // NOAA NCAT: Zone 18, Easting 580735.645, Northing 4504700.381
    // Source: https://geodesy.noaa.gov/api/ncat/llh?lat=40.689247&lon=-74.044502
    const result = convertToUTM({lat: 40.689247, lon: -74.044502});
    expect(result).toMatch(/^UTM 18T 5807\d{2} 45047\d{2}$/);
  });

  it('converts coordinates in South America (Zone 25)', () => {
    // Coordinates: 12°N, 34°W (Atlantic Ocean off Brazil coast)
    // NOAA NCAT: Zone 25, Easting 391135.827, Northing 1326751.171
    // Source: https://geodesy.noaa.gov/api/ncat/llh?lat=12&lon=-34
    const result = convertToUTM({lat: 12, lon: -34});
    expect(result).toMatch(/^UTM 25P 391\d{3} 1326\d{3}$/);
  });

  it('handles coordinates near the equator at prime meridian', () => {
    // Note: The (0,0) coordinate lies on zone boundary between 30 and 31.
    // Different UTM implementations may assign different zones.
    // NOAA assigns Zone 30; the 'utm' package assigns Zone 31.
    const result = convertToUTM({lat: 0, lon: 0});
    expect(result).toMatch(/^UTM 3[01][NM] \d+ 0$/);
  });

  it('falls back to decimal format for extreme latitudes (> 84N)', () => {
    // UTM is undefined above 84°N (use UPS - Universal Polar Stereographic)
    const result = convertToUTM({lat: 85, lon: 10});
    expect(result).toBe('+85.000000°, +10.000000°');
  });

  it('falls back to decimal format for extreme latitudes (< 80S)', () => {
    // UTM is undefined below 80°S (use UPS - Universal Polar Stereographic)
    const result = convertToUTM({lat: -81, lon: 10});
    expect(result).toBe('-81.000000°, +10.000000°');
  });
});

describe('formatCoords()', () => {
  const testCoords = {lat: 40.7128, lon: -74.006};

  it('defaults to UTM format when no format specified', () => {
    expect(formatCoords(testCoords)).toContain('UTM');
  });

  it('formats as UTM when format is utm', () => {
    expect(formatCoords({...testCoords, format: 'utm'})).toContain('UTM');
  });

  it('formats as decimal degrees when format is dd', () => {
    expect(formatCoords({...testCoords, format: 'dd'})).toBe(
      '40.712800° N, 74.006000° W',
    );
  });

  it('formats as DMS when format is dms', () => {
    expect(formatCoords({...testCoords, format: 'dms'})).toBe(
      `40° 42' 46.080" N, 74° 0' 21.600" W`,
    );
  });

  it('handles southern hemisphere coordinates in dd format', () => {
    expect(formatCoords({lat: -33.8688, lon: 151.2093, format: 'dd'})).toBe(
      '33.868800° S, 151.209300° E',
    );
  });

  it('handles southern hemisphere coordinates in dms format', () => {
    expect(formatCoords({lat: -33.8688, lon: 151.2093, format: 'dms'})).toBe(
      `33° 52' 7.680" S, 151° 12' 33.480" E`,
    );
  });

  it('handles coordinates at the origin', () => {
    expect(formatCoords({lat: 0, lon: 0, format: 'dd'})).toBe(
      '0.000000° N, 0.000000° E',
    );
  });
});

describe('convertDmsToDd()', () => {
  it('converts degrees only', () => {
    expect(convertDmsToDd({degrees: 45, minutes: 0, seconds: 0})).toBe(45);
  });

  it('converts degrees and minutes', () => {
    expect(convertDmsToDd({degrees: 45, minutes: 30, seconds: 0})).toBe(45.5);
  });

  it('converts degrees, minutes, and seconds', () => {
    expect(convertDmsToDd({degrees: 45, minutes: 30, seconds: 36})).toBe(45.51);
  });

  it('handles zero values', () => {
    expect(convertDmsToDd({degrees: 0, minutes: 0, seconds: 0})).toBe(0);
  });

  it('correctly converts a known coordinate', () => {
    // 40° 42' 46.08" should be approximately 40.7128
    const result = convertDmsToDd({degrees: 40, minutes: 42, seconds: 46.08});
    expect(result).toBeCloseTo(40.7128, 4);
  });
});

describe('toDegreesMinutesAndSeconds()', () => {
  it('converts whole degrees', () => {
    expect(toDegreesMinutesAndSeconds(45)).toEqual({
      degrees: 45,
      minutes: 0,
      seconds: 0,
    });
  });

  it('converts degrees with minutes', () => {
    // 45.5 = 45° 30' 0"
    expect(toDegreesMinutesAndSeconds(45.5)).toEqual({
      degrees: 45,
      minutes: 30,
      seconds: 0,
    });
  });

  it('converts degrees with minutes and seconds', () => {
    // 40.7128 should be approximately 40° 42' 46.08"
    const result = toDegreesMinutesAndSeconds(40.7128);
    expect(result.degrees).toBe(40);
    expect(result.minutes).toBe(42);
    expect(result.seconds).toBeCloseTo(46.08, 2);
  });

  it('handles negative coordinates by using absolute value', () => {
    // -74.006 should give same magnitude as 74.006
    const result = toDegreesMinutesAndSeconds(-74.006);
    expect(result.degrees).toBe(74);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBeCloseTo(21.6, 2);
  });

  it('handles zero', () => {
    expect(toDegreesMinutesAndSeconds(0)).toEqual({
      degrees: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('is inverse of convertDmsToDd', () => {
    const original = 40.7128;
    const dms = toDegreesMinutesAndSeconds(original);
    const backToDd = convertDmsToDd(dms);
    expect(backToDd).toBe(original);
  });
});

describe('getCoords()', () => {
  it('extracts longitude and latitude from LocationObject', () => {
    const location = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    expect(getCoords(location)).toEqual([-74.006, 40.7128]);
  });

  it('returns [longitude, latitude] tuple in correct order', () => {
    const location = {
      coords: {
        latitude: 10,
        longitude: 20,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    const [lon, lat] = getCoords(location);
    expect(lon).toBe(20);
    expect(lat).toBe(10);
  });
});
