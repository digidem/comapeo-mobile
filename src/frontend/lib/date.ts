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
