import {useEffect, useState} from 'react';
import {Duration} from 'luxon';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (start) {
      setCurrentTime(new Date());
      timer = setInterval(() => {
        setCurrentTime(new Date());
      }, interval);
    }
    return () => clearInterval(timer);
  }, [start, interval]);

  if (!start) return 'Unknown';

  const millisPassed = Math.abs(currentTime.getTime() - start.getTime());
  return Duration.fromMillis(millisPassed).toFormat('hh:mm:ss');
};
