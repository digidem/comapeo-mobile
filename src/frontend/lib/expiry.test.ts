import {getTimeRemaining} from './expiry';

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

describe('getTimeRemaining', () => {
  it.each([
    ['a full day', 24 * HOUR, {unit: 'hours', value: 24}],
    ['exactly two hours', 2 * HOUR, {unit: 'hours', value: 2}],
    [
      'hours, dropping the leftover minutes',
      3 * HOUR + 59 * MINUTE,
      {
        unit: 'hours',
        value: 3,
      },
    ],
    [
      'just under two hours as minutes',
      2 * HOUR - 1,
      {
        unit: 'minutes',
        value: 119,
      },
    ],
    ['exactly one minute', MINUTE, {unit: 'minutes', value: 1}],
    [
      'just under a minute as seconds',
      MINUTE - 1,
      {
        unit: 'seconds',
        value: 59,
      },
    ],
    ['one second', 1000, {unit: 'seconds', value: 1}],
    ['nothing left', 0, {unit: 'seconds', value: 0}],
  ])('reports %s', (_label, ms, expected) => {
    expect(getTimeRemaining(ms)).toEqual(expected);
  });

  it('clamps an expired link rather than counting backwards', () => {
    expect(getTimeRemaining(-5000)).toEqual({unit: 'seconds', value: 0});
  });

  it('drops sub-second remainders rather than rounding up', () => {
    expect(getTimeRemaining(1999)).toEqual({unit: 'seconds', value: 1});
  });
});
