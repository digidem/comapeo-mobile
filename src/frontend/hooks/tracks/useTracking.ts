import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {useCallback, useState} from 'react';
import {FullLocationData, useTracksStore} from './useTracksStore';

export const LOCATION_TASK_NAME = 'background-location-task';

type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};
export function useTracking() {
  const [loading, setLoading] = useState(false);
  const tracksStore = useTracksStore();
  const isTracking = useTracksStore(state => state.isTracking);
  const addNewTrackLocations = useCallback(
    ({data, error}: LocationCallbackInfo) => {
      if (error) {
        console.error('Error while processing location update callback', error);
      }
      if (data?.locations) {
        tracksStore.addNewLocations(data.locations);
      }
    },
    [tracksStore],
  );

  const startTracking = useCallback(async () => {
    setLoading(true);
    TaskManager.defineTask(LOCATION_TASK_NAME, addNewTrackLocations);

    if (isTracking) {
      console.warn('Start tracking attempt while tracking already enabled');
      setLoading(false);
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      activityType: Location.LocationActivityType.Fitness,
    });

    tracksStore.setTracking(true);
    setLoading(false);
  }, [addNewTrackLocations, isTracking, tracksStore]);

  const cancelTracking = useCallback(async () => {
    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    tracksStore.setTracking(false);
  }, [tracksStore]);

  return {isTracking, startTracking, cancelTracking, loading};
}
