import * as React from 'react';

/**
 * A clock that re-renders on an interval, for countdowns. Reading Date.now()
 * during render is impure, so the current time has to come from state.
 */
export function useNow(intervalMs: number = 1000): number {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
}
