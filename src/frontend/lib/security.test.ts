import {is} from 'valibot';

import {DEFAULT_OBSCURE_CODE, PasscodeSchema} from './security';

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
