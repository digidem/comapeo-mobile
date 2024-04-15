import {useEffect, useState} from 'react';

export const useFormattedTimeSince = (start: Date, interval: number) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return secondsToHMS(
    Math.floor((currentTime.getTime() - start.getTime()) / 1000),
  );
};

const secondsToHMS = (secs: number) => {
  function z(n: number) {
    return (n < 10 ? '0' : '') + n;
  }
  var sign = secs < 0 ? '-' : '';
  secs = Math.abs(secs);
  /* eslint-disable no-bitwise */
  return (
    sign +
    z((secs / 3600) | 0) +
    ':' +
    z(((secs % 3600) / 60) | 0) +
    ':' +
    z(secs % 60)
  );
};
