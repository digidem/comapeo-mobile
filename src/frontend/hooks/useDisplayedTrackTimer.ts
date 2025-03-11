import {useTrackState} from '../contexts/TrackStoreContext';
import {useFormattedTimeSince} from './useFormattedTimeSince';

export function useDisplayedTrackTimer() {
  const trackingSince = useTrackState(state => state.trackingSince);
  return useFormattedTimeSince(trackingSince, 1000);
}
