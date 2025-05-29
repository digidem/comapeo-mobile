import {TrackState, useTrackState} from '../contexts/TrackStoreContext.tsx';
import {calculateTotalDistance} from '../utils/distance.ts';

type CurrentTrackState =
  | {
      hasActiveTrack: false;
      locationHistory: TrackState['locationHistory'];
      totalDistance: 0;
      trackingSince: null;
    }
  | {
      hasActiveTrack: true;
      locationHistory: TrackState['locationHistory'];
      totalDistance: number;
      trackingSince: Date;
    };

export const useCurrentTrackState = (): CurrentTrackState => {
  const locationHistory = useTrackState(state => state.locationHistory);

  if (locationHistory.length === 0) {
    return {
      hasActiveTrack: false,
      locationHistory,
      trackingSince: null,
      totalDistance: 0,
    };
  }

  return {
    hasActiveTrack: true,
    locationHistory,
    totalDistance: calculateTotalDistance({
      points: locationHistory,
      units: 'kilometers',
    }),
    trackingSince: new Date(locationHistory[0]!.timestamp),
  };
};
