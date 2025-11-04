import {calcUsedPercentage, isLowStorage, LOW_THRESHOLD_BYTES} from './storage';

describe('calcUsedPercentage', () => {
  it('handles basic math', () => {
    expect(calcUsedPercentage(50, 100)).toBe(50);
    expect(calcUsedPercentage(0, 100)).toBe(100);
  });
  it('deals with negatives and zero', () => {
    expect(calcUsedPercentage(-10, 100)).toBe(100);
    expect(calcUsedPercentage(10, 0)).toBe(0);
  });
});

describe('isLowStorage', () => {
  it('compares threshold', () => {
    expect(isLowStorage(LOW_THRESHOLD_BYTES - 1)).toBe(true);
    expect(isLowStorage(LOW_THRESHOLD_BYTES)).toBe(true);
    expect(isLowStorage(LOW_THRESHOLD_BYTES + 1)).toBe(false);
  });
});
