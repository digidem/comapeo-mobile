import * as Location from 'expo-location';
import {useCallback, useState} from 'react';
import {usePersistedTrack} from './persistedState/usePersistedTrack';
import {useGPSModalContext} from '../contexts/GPSModalContext.tsx';
import {LOCATION_TASK_NAME} from '../lib/trackLocationsStorage.ts';

export function useTracking() {
  const {bottomSheetRef} = useGPSModalContext();
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
      activityType: Location.LocationActivityType.Fitness,
    });

    setTracking(true);
    setLoading(false);
  }, [isTracking, setTracking]);

  const cancelTracking = useCallback(async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    bottomSheetRef.current?.close();
    setTracking(false);
  }, [bottomSheetRef, setTracking]);

  return {isTracking, startTracking, cancelTracking, loading};
}
