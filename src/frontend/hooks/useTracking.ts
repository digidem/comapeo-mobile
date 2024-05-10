import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {useCallback, useState} from 'react';
import {usePersistedTrack} from './persistedState/usePersistedTrack';
import {FullLocationData} from '../sharedTypes/location';
import {useInterval} from 'react-native-confirmation-code-field/esm/useTimer';
import {useGPSModalContext} from '../contexts/GPSModalContext.tsx';
import {getData, LOCATION_TASK_NAME} from '../lib/trackLocationsStorage.ts';

type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};

export function useTracking() {
  const {bottomSheetRef} = useGPSModalContext();
  const [loading, setLoading] = useState(false);
  const setLocations = usePersistedTrack(state => state.setLocations);
  const setTracking = usePersistedTrack(state => state.setTracking);
  const isTracking = usePersistedTrack(state => state.isTracking);

  useInterval(
    useCallback(() => {
      async function update() {
        const newLocations = await getData();
        if (newLocations !== null) {
          setLocations(newLocations);
        }
      }

      update();
    }, []),
    250,
  );

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
