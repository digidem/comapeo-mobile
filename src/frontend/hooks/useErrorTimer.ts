import {useState, useRef, useEffect} from 'react';

export function useErrorTimeout() {
  const [errorTimeout, setErrorTimeout] = useState(false);
  const timer = useRef<NodeJS.Timeout | undefined>();

  useEffect(() => {
    if (errorTimeout && !timer.current) {
      timer.current = setTimeout(() => {
        setErrorTimeout(false);
        timer.current = undefined;
      }, 1500);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [errorTimeout]);

  return [
    errorTimeout,
    () => setErrorTimeout(prevVal => (!prevVal ? true : prevVal)),
  ] as const;
}
