import {useEffect, useState} from 'react';
import {millisecondsToHHMMSS} from '../lib/millisecondsToFormattedTime';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const startDate = start ? new Date(start) : new Date();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const millisPassed = Math.abs(currentTime.getTime() - startDate.getTime());
  return millisecondsToHHMMSS(millisPassed);
};
