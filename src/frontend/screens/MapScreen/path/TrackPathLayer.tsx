import * as React from 'react';
import {useLocation} from '../../../hooks/useLocation';
import {PathLayer} from './PathLayer';
import {usePersistedTrack} from '../../../hooks/persistedState/usePersistedTrack';

export const TrackPathLayer = () => {
  const locationHistory = usePersistedTrack(state => state.locationHistory);
  const isTracking = usePersistedTrack(state => state.isTracking);
  const {location} = useLocation({maxDistanceInterval: 3});
  const finalLocationHistory = location?.coords
    ? [
        ...locationHistory,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date().getTime(),
        },
      ]
    : locationHistory;

  return (
    locationHistory.length > 1 &&
    isTracking && <PathLayer locationHistory={finalLocationHistory} />
  );
};
