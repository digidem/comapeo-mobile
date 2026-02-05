import {useEffect, useRef, useState} from 'react';

function calcMinutes(lockUntil: number): number {
  const remaining = Math.ceil((lockUntil - Date.now()) / 60_000);
  return remaining > 0 ? remaining : 0;
}

export function usePasscodeLockout({
  lockUntil,
  clearError,
}: {
  lockUntil: number;
  clearError: () => void;
}): number {
  const [minutes, setMinutes] = useState(() => calcMinutes(lockUntil));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const update = () => {
      const mins = calcMinutes(lockUntil);
      setMinutes(mins);
      if (!mins && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        clearError();
      }
    };

    update();

    if (!calcMinutes(lockUntil)) return;

    intervalRef.current = setInterval(update, 15_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lockUntil, clearError]);

  return minutes;
}
