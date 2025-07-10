import {is} from 'valibot';

import {
  DEFAULT_OBSCURE_CODE,
  PasscodeSchema,
  getRemainingLockoutMinutes,
  getLockoutThreshold,
} from './security';

test('DEFAULT_OBSCURE_CODE has expected value', () => {
  expect(DEFAULT_OBSCURE_CODE).toBe('00000');
});

describe('PasscodeSchema', () => {
  test('handles valid values', () => {
    expect(is(PasscodeSchema, '12345')).toBe(true);
  });

  test('handles invalid values', () => {
    // Incorrect length
    expect(is(PasscodeSchema, '')).toBe(false);
    expect(is(PasscodeSchema, '123')).toBe(false);
    expect(is(PasscodeSchema, '123456')).toBe(false);

    // Non-digits
    expect(is(PasscodeSchema, 'abcde')).toBe(false);
    expect(is(PasscodeSchema, '123.4')).toBe(false);
  });
});

describe('getRemainingLockoutMinutes', () => {
  test('returns 0 when lockUntil is null', () => {
    expect(getRemainingLockoutMinutes(null)).toBe(0);
  });

  test('returns rounded-up minutes if in future', () => {
    const future = Date.now() + 2.3 * 60 * 1000;
    expect(getRemainingLockoutMinutes(future)).toBe(3);
  });

  test('returns 0 if lockUntil is in the past', () => {
    const past = Date.now() - 60 * 1000;
    expect(getRemainingLockoutMinutes(past)).toBe(0);
  });
});

describe('getLockoutThreshold', () => {
  test.each([
    [1, null],
    [4, null],
    [5, 1],
    [7, 3],
    [8, 5],
    [9, 5],
    [20, 5],
  ])('returns expected minutes for %i attempts', (attempts, expected) => {
    expect(getLockoutThreshold(attempts)).toBe(expected);
  });
});
