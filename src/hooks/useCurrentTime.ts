import {useEffect, useState} from 'react';

export const useCurrentTime = (interval: number): Date => {
  const [result, setResult] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setResult(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return result;
};
