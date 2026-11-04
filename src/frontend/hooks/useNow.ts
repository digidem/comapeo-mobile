import * as React from 'react';

/**
 * A clock that re-renders on an interval, for countdowns. Reading Date.now()
 * during render is impure, so the current time has to come from state.
 */
const TICK_MS = 1000;

export function useNow(): number {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(interval);
  }, []);

  return now;
}
