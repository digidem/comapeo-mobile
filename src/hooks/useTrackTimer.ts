import {useTrackState} from '../contexts/TrackStoreContext.tsx';
import {useFormattedTimeSince} from './useFormattedTimeSince.ts';

export function useTrackTimer() {
  const trackingSince = useTrackState(state => state.trackingSince);
  const timer = useFormattedTimeSince(trackingSince, 1000);
  return timer;
}
