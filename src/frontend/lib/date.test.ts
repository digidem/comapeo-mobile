import {parseISO} from 'date-fns';
import {
  beginningOfMonthUtc,
  formatIsoUtc,
  isDateValid,
  isSameUtcMonthAndYear,
  parseIsoUtc,
} from './date';

describe('beginningOfMonthUtc', () => {
  it('returns the first day of the month (in UTC)', () => {
    const input = parseISO('2012-03-04T06:09:42.0Z');
    const result = beginningOfMonthUtc(input);
    expect(result.getUTCFullYear()).toBe(2012);
    expect(result.getUTCMonth()).toBe(2);
    expect(result.getUTCDate()).toBe(1);
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
  });
});

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

describe('parseIsoUtc', () => {
  it('returns null for invalid date strings', () => {
    const testCases = [
      '',
      '1234',
      '123-06-09',
      '20000102',
      '2000-13-01',
      '2000-12-32',
      '2001-02-29',
      ' 2001-01-02 ',
      new Date().toISOString(),
    ];
    for (const input of testCases) {
      expect(parseIsoUtc(input)).toBeNull();
    }
  });

  it('parses every day in a leap year', () => {
    const year = 2024;
    for (let month = 1; month <= 12; month++) {
      let daysInMonth = 31;
      if (month === 2) {
        daysInMonth = 29;
      } else if ([4, 6, 9, 11].includes(month)) {
        daysInMonth = 30;
      }
      for (let date = 1; date <= daysInMonth; date++) {
        const str = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        const parsed = parseIsoUtc(str);
        expect(parsed?.getUTCFullYear()).toBe(year);
        expect(parsed?.getUTCMonth()).toBe(month - 1);
        expect(parsed?.getUTCDate()).toBe(date);
        expect(parsed?.getUTCHours()).toBe(0);
        expect(parsed?.getUTCMinutes()).toBe(0);
        expect(parsed?.getUTCSeconds()).toBe(0);
        expect(parsed?.getUTCMilliseconds()).toBe(0);
      }
    }
  });

  it('parses every day in a non-leap year', () => {
    const year = 2023;
    for (let month = 1; month <= 12; month++) {
      let daysInMonth = 31;
      if (month === 2) {
        daysInMonth = 28;
      } else if ([4, 6, 9, 11].includes(month)) {
        daysInMonth = 30;
      }
      for (let date = 1; date <= daysInMonth; date++) {
        const str = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
        const parsed = parseIsoUtc(str);
        expect(parsed?.getUTCFullYear()).toBe(year);
        expect(parsed?.getUTCMonth()).toBe(month - 1);
        expect(parsed?.getUTCDate()).toBe(date);
        expect(parsed?.getUTCHours()).toBe(0);
        expect(parsed?.getUTCMinutes()).toBe(0);
        expect(parsed?.getUTCSeconds()).toBe(0);
        expect(parsed?.getUTCMilliseconds()).toBe(0);
      }
    }
  });

  it("parses today's date", () => {
    const today = new Date();
    const parsed = parseIsoUtc(formatIsoUtc(today));
    expect(parsed?.getUTCFullYear()).toBe(today.getUTCFullYear());
    expect(parsed?.getUTCMonth()).toBe(today.getUTCMonth());
    expect(parsed?.getUTCDate()).toBe(today.getUTCDate());
    expect(parsed?.getUTCHours()).toBe(0);
    expect(parsed?.getUTCMinutes()).toBe(0);
    expect(parsed?.getUTCSeconds()).toBe(0);
    expect(parsed?.getUTCMilliseconds()).toBe(0);
  });

  it('parses years far in the future', () => {
    const parsed = parseIsoUtc('12345-02-03');
    expect(parsed?.getUTCFullYear()).toBe(12345);
  });
});
