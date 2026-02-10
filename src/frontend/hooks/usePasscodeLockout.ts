import {useEffect, useRef, useState} from 'react';
import {getRemainingLockoutMinutes} from '../lib/security';

export function usePasscodeLockout({
  lockUntil,
  clearError,
}: {
  lockUntil: number;
  clearError: () => void;
}): number {
  const [minutes, setMinutes] = useState(() =>
    getRemainingLockoutMinutes(lockUntil),
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const update = () => {
      const mins = getRemainingLockoutMinutes(lockUntil);
      setMinutes(mins);
      if (!mins && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        clearError();
      }
    };

    update();

    if (!getRemainingLockoutMinutes(lockUntil)) return;

    intervalRef.current = setInterval(update, 15_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lockUntil, clearError]);

  return minutes;
}
