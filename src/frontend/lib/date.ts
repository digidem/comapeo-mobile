export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;

export const formatIsoUtc = (date: Readonly<Date>): string =>
  [
    date.getUTCFullYear().toString().padStart(4, '0'),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
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

export const subDays = (date: Readonly<Date>, days: number): Date => {
  const epoch = date.valueOf() - days * DAY_MS;
  return new Date(epoch);
};
