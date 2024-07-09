import {
  formatIsoUtc,
  isDateValid,
  isSameUtcMonthAndYear,
  subDays,
} from './date';
import {parseISO} from 'date-fns';

describe('formatIsoUtc', () => {
  it('formats dates (without times)', () => {
    const date = parseISO('2012-03-04T06:09:42.0Z');
    expect(formatIsoUtc(date)).toBe('2012-03-04');
  });
});

describe('isDateValid', () => {
  it('returns true for valid dates', () => {
    expect(isDateValid(new Date())).toBe(true);
    expect(isDateValid(new Date(0))).toBe(true);
  });

  it('returns false for invalid dates', () => {
    expect(isDateValid(new Date(NaN))).toBe(false);
    expect(isDateValid(new Date(Infinity))).toBe(false);
  });
});

describe('isSameUtcMonthAndYear', () => {
  const day1 = parseISO('2000-06-06T06:06:00Z');
  const day2 = parseISO('2000-06-09T04:20:00Z');
  const day3 = parseISO('2000-07-01T04:20:00Z');
  const day4 = parseISO('2002-06-06T06:06:00Z');

  it('returns true for dates in the same month and year', () => {
    expect(isSameUtcMonthAndYear(day1, day1)).toBe(true);
    expect(isSameUtcMonthAndYear(day1, day2)).toBe(true);
  });

  it('returns false for dates not in the same month and year', () => {
    expect(isSameUtcMonthAndYear(day1, day3)).toBe(false);
    expect(isSameUtcMonthAndYear(day1, day4)).toBe(false);
  });
});

describe('subDays', () => {
  it('subtracts days', () => {
    const date = parseISO('2012-03-04T06:09:42.0Z');

    expect(subDays(date, 0)).toEqual(date);
    expect(subDays(date, 1)).toEqual(parseISO('2012-03-03T06:09:42.0Z'));
    expect(subDays(date, 10)).toEqual(parseISO('2012-02-23T06:09:42.0Z'));
  });

  it("doesn't modify the input", () => {
    const date = parseISO('2012-03-04T06:09:42.0Z');
    const before = date.valueOf();

    subDays(date, 123);

    const after = date.valueOf();
    expect(before).toBe(after);
  });
});
