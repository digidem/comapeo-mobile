import {calcPhotoTimeRelativeToObs, calculateDistanceAsMeters} from './helpers';

describe('calculateDistanceAsMeters (real Turf)', () => {
  it('returns 0 for identical coordinates', () => {
    const result = calculateDistanceAsMeters({
      photoLocation: [0, 0],
      observationLocation: [0, 0],
    });
    expect(result).toBe(0);
  });

  it('computes ~157 km between (0,0) and (1,0)', () => {
    const result = calculateDistanceAsMeters({
      photoLocation: [0, 0],
      observationLocation: [1, 0],
    });
    expect(result).toBeCloseTo(111_000, -3); // within ~1km
  });

  it('computes ~157 km between (0,0) and (0,1)', () => {
    const result = calculateDistanceAsMeters({
      photoLocation: [0, 0],
      observationLocation: [0, 1],
    });
    expect(result).toBeCloseTo(111_000, -3);
  });
});

describe('calcPhotoTimeRelativeToObs', () => {
  it('returns seconds when less than 60s', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 10000,
      observationCreatedAt: 9500,
    });
    expect(result).toEqual({value: 0, unit: 'second'}); // 500ms diff → 0s
  });

  it('returns minutes when at least 60s but less than 1h', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 60_000 * 5 + 5000, // 5m 5s
      observationCreatedAt: 0,
    });
    expect(result).toEqual({value: 5, unit: 'minute'});
  });

  it('returns hours when at least 1h', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 3 * 3600_000 + 2000, // 3h 2s
      observationCreatedAt: 0,
    });
    expect(result).toEqual({value: 3, unit: 'hour'});
  });

  it('handles negative differences correctly (photo before observation)', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 0,
      observationCreatedAt: 3600_000, // 1h later
    });
    expect(result).toEqual({value: -1, unit: 'hour'});
  });

  it('handles exactly 1 minute difference', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 60_000,
      observationCreatedAt: 0,
    });
    expect(result).toEqual({value: 1, unit: 'minute'});
  });

  it('handles exactly 1 hour difference', () => {
    const result = calcPhotoTimeRelativeToObs({
      photoCreatedAt: 3600_000,
      observationCreatedAt: 0,
    });
    expect(result).toEqual({value: 1, unit: 'hour'});
  });
});
