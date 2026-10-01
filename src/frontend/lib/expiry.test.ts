import {formatTimeRemaining} from './expiry';

describe('formatTimeRemaining', () => {
  it.each([
    ['a full day', 24 * 60 * 60 * 1000, '24:00:00'],
    [
      'just under a day',
      23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000,
      '23:59:59',
    ],
    ['minutes and seconds only', 5 * 60 * 1000 + 7 * 1000, '00:05:07'],
    ['one second', 1000, '00:00:01'],
    ['nothing left', 0, '00:00:00'],
  ])('formats %s', (_label, ms, expected) => {
    expect(formatTimeRemaining(ms)).toBe(expected);
  });

  it('clamps an expired link rather than counting backwards', () => {
    expect(formatTimeRemaining(-5000)).toBe('00:00:00');
  });

  it('drops sub-second remainders rather than rounding up', () => {
    expect(formatTimeRemaining(1999)).toBe('00:00:01');
  });
});
