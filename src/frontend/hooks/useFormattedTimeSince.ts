import {millisecondsToHHMMSS} from '../lib/millisecondsToFormattedTime';
import {useCurrentTime} from './useCurrentTime';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const currentTime = useCurrentTime(interval);

  const millisPassed = start
    ? Math.abs(currentTime.getTime() - start.getTime())
    : 0;
  return millisecondsToHHMMSS(millisPassed);
};
