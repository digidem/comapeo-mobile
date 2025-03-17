import * as Location from 'expo-location';
import {useCallback, useState} from 'react';
import {usePersistedTrack} from './persistedState/usePersistedTrack';
import {LOCATION_TASK_NAME} from '../sharedTypes/location.ts';

/**
 * This constant should be used for tracks and for the userlocation dot. In order for the user location dot to align with the track on the map, they need to update at the same frequency.
 */
const TRACKING_DISTANCE_INTERVAL = 2;

export function useTracking() {
  const [loading, setLoading] = useState(false);
  const setTracking = usePersistedTrack(state => state.setTracking);
  const isTracking = usePersistedTrack(state => state.isTracking);

  const startTracking = useCallback(async () => {
    if (isTracking) {
      console.warn('Start tracking attempt while tracking already enabled');
      setLoading(false);
      return;
    }

    setLoading(true);

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: TRACKING_DISTANCE_INTERVAL,
    });

    setTracking(true);
    setLoading(false);
  }, [isTracking, setTracking]);

  const cancelTracking = useCallback(async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    setTracking(false);
  }, [setTracking]);

  return {isTracking, startTracking, cancelTracking, loading};
}
