import {millisecondsToHHMMSS} from '../lib/millisecondsToFormattedTime';
import {useCurrentTime} from './useCurrentTime';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const currentTime = useCurrentTime(interval);

  const startDate = start instanceof Date ? start : null;

  const millisPassed = startDate
    ? Math.abs(currentTime.getTime() - startDate.getTime())
    : 0;
  return millisecondsToHHMMSS(millisPassed);
};
