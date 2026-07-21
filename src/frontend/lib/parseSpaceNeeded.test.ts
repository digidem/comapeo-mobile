import {formatSpaceNeeded, parseSpaceNeeded} from './parseSpaceNeeded';

describe('parseSpaceNeeded', () => {
  test('parses a byte count from the context string', () => {
    expect(parseSpaceNeeded('52428800')).toBe(52_428_800);
  });

  test('returns null for missing, malformed, or non-positive contexts', () => {
    expect(parseSpaceNeeded(undefined)).toBeNull();
    expect(parseSpaceNeeded('')).toBeNull();
    expect(parseSpaceNeeded('not a number')).toBeNull();
    expect(parseSpaceNeeded('0')).toBeNull();
    expect(parseSpaceNeeded('-100')).toBeNull();
  });
});

describe('formatSpaceNeeded', () => {
  test('formats bytes into the largest whole unit, rounded up', () => {
    expect(formatSpaceNeeded(500)).toBe('~500 B');
    expect(formatSpaceNeeded(52_428_800)).toBe('~50 MB');
    expect(formatSpaceNeeded(1_610_612_736)).toBe('~1.5 GB');
  });

  test('rounds up rather than down', () => {
    expect(formatSpaceNeeded(1_048_577)).toBe('~1.1 MB');
    expect(formatSpaceNeeded(9 * 1024 * 1024 + 1)).toBe('~9.1 MB');
    expect(formatSpaceNeeded(11 * 1024 * 1024 + 1)).toBe('~12 MB');
  });
});
