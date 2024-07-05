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

export const beginningOfNextMonthUtc = (date: Readonly<Date>): Date => {
  const result = new Date(date);
  result.setUTCFullYear(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
  result.setUTCHours(0, 0, 0, 0);
  return result;
};
