import {useTrackState} from '../contexts/TrackStoreContext.tsx';

export const useHasActiveTrack = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  return locationHistory.length !== 0;
};
