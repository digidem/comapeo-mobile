import {useEffect, useState} from 'react';
import {Duration} from 'luxon';

export const useFormattedTimeSince = (start: Date, interval: number) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  const millisPassed = currentTime.getTime() - start.getTime();
  return Duration.fromMillis(millisPassed).toFormat('hh:mm:ss');
};
