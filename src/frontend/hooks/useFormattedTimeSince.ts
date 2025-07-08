import {millisecondsToHHMMSS} from '../lib/millisecondsToFormattedTime';
import {useCurrentTime} from './useCurrentTime';

export const useFormattedTimeSince = (start: Date | null, interval: number) => {
  const currentTime = useCurrentTime(interval);
  const startDate = start ? new Date(start) : new Date();

  const millisPassed = Math.abs(currentTime.getTime() - startDate.getTime());
  return millisecondsToHHMMSS(millisPassed);
};
