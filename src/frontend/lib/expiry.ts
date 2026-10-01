const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

/** `HH:MM:SS` of time left */
export function formatTimeRemaining(msRemaining: number): string {
  const remaining = Math.max(msRemaining, 0);
  const hours = Math.floor(remaining / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remaining % MINUTE_MS) / 1000);

  return [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':');
}
