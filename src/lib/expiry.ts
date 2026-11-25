const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const SECOND_MS = 1000;

// Anything from 60 to 119 minutes would read as "1 hour", so design asked for
// minutes below two hours rather than below one.
const HOURS_FLOOR_MS = 2 * HOUR_MS;

export type TimeRemaining = {
  unit: 'hours' | 'minutes' | 'seconds';
  value: number;
};

/** The largest whole unit left, so a countdown label changes as rarely as it can. */
export function getTimeRemaining(msRemaining: number): TimeRemaining {
  const remaining = Math.max(msRemaining, 0);

  if (remaining >= HOURS_FLOOR_MS) {
    return {unit: 'hours', value: Math.floor(remaining / HOUR_MS)};
  }

  if (remaining >= MINUTE_MS) {
    return {unit: 'minutes', value: Math.floor(remaining / MINUTE_MS)};
  }

  return {unit: 'seconds', value: Math.floor(remaining / SECOND_MS)};
}
