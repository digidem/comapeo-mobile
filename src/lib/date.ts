export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;
const ISO_DATE_REGEXP = /^(?<year>\d{4,})-(?<month>\d{2})-(?<day>\d{2})$/;

export const beginningOfMonthUtc = (date: Readonly<Date>): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));

export const formatIsoUtc = (date: Readonly<Date>): string =>
  [
    date.getUTCFullYear().toString().padStart(4, '0'),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0'),
  ].join('-');

export const isDateValid = (date: Readonly<Date>): boolean =>
  !isNaN(date.valueOf());

const isSameUtcMonth = (a: Readonly<Date>, b: Readonly<Date>): boolean =>
  a.getUTCMonth() === b.getUTCMonth();

const isSameUtcYear = (a: Readonly<Date>, b: Readonly<Date>): boolean =>
  a.getUTCFullYear() === b.getUTCFullYear();

export const isSameUtcMonthAndYear = (
  a: Readonly<Date>,
  b: Readonly<Date>,
): boolean => isSameUtcMonth(a, b) && isSameUtcYear(a, b);

const parseMaybeInt = (str: undefined | string): number =>
  parseInt(str || '', 10);

const getDaysInMonth = (year: number, monthIndex: number): number =>
  new Date(year, monthIndex + 1, 0, 0).getDate();

export const parseIsoUtc = (str: string): null | Date => {
  const matchGroups = str.match(ISO_DATE_REGEXP)?.groups;
  if (!matchGroups) return null;

  const year = parseMaybeInt(matchGroups.year);
  if (!year) return null;

  const monthIndex = parseMaybeInt(matchGroups.month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;

  const day = parseMaybeInt(matchGroups.day);
  if (!day || day > getDaysInMonth(year, monthIndex)) return null;

  const result = new Date(
    Date.UTC(year, monthIndex, parseMaybeInt(matchGroups.day)),
  );
  return isDateValid(result) ? result : null;
};
