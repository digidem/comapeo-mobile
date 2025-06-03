import {useTrackState} from '../contexts/TrackStoreContext.tsx';

export const useHasActiveTrack = () => {
  const startTime = useTrackState(state => state.startTime);
  return startTime !== null;
};
