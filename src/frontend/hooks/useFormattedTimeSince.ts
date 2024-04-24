import {useEffect, useState} from 'react';
import {Duration} from 'luxon';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  let startDate = start ? start : new Date();

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const millisPassed = Math.abs(currentTime.getTime() - startDate.getTime());
  return Duration.fromMillis(millisPassed).toFormat('hh:mm:ss');
};
