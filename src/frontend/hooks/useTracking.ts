import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {useCallback, useState} from 'react';
import {usePersistedTrack} from './persistedState/usePersistedTrack';
import {FullLocationData} from '../sharedTypes/location';
import {useGPSModalContext} from '../../contexts/GPSModalContext';
import {getData, LOCATION_TASK_NAME} from '../../lib/trackLocationsStorage';
import {useInterval} from 'react-native-confirmation-code-field/esm/useTimer';

type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};

export function useTracking() {
  const {bottomSheetRef} = useGPSModalContext();
  const [loading, setLoading] = useState(false);
  const addNewLocations = usePersistedTrack(state => state.addNewLocations);
  const setTracking = usePersistedTrack(state => state.setTracking);
  const isTracking = usePersistedTrack(state => state.isTracking);

  useInterval(
    useCallback(() => {
      async function update() {
        const newLocations = await getData();
        if (newLocations !== null) {
          addNewLocations(newLocations);
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
