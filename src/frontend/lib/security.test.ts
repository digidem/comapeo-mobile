import {DEFAULT_OBSCURE_CODE, isValidPasscode} from './security';

test('DEFAULT_OBSCURE_CODE has expected value', () => {
  expect(DEFAULT_OBSCURE_CODE).toBe('00000');
});

describe('isValidPasscode()', () => {
  test('handles valid values', () => {
    expect(isValidPasscode('12345')).toBe(true);
  });

  test('handles invalid values', () => {
    // Incorrect length
    expect(isValidPasscode('')).toBe(false);
    expect(isValidPasscode('123')).toBe(false);
    expect(isValidPasscode('123456')).toBe(false);

    // Non-digits
    expect(isValidPasscode('abcde')).toBe(false);
    expect(isValidPasscode('123.4')).toBe(false);
  });
});
