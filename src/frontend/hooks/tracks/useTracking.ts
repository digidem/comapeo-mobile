import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {useCallback, useState} from 'react';
import {FullLocationData, useCurrentTrackStore} from './useCurrentTrackStore';
import React from 'react';

export const LOCATION_TASK_NAME = 'background-location-task';

type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};
export function useTracking() {
  const [loading, setLoading] = useState(false);
  const tracksStore = useCurrentTrackStore();
  const isTracking = useCurrentTrackStore(state => state.isTracking);

  React.useEffect(() => {
    TaskManager.defineTask(LOCATION_TASK_NAME, addNewTrackLocations);
  }, []);

  const addNewTrackLocations = useCallback(
    ({data, error}: LocationCallbackInfo) => {
      if (error) {
        console.error('Error while processing location update callback', error);
      }
      if (data?.locations) {
        tracksStore.addNewLocations(
          data.locations.map(loc => ({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
          })),
        );
      }
    },
    [tracksStore],
  );

  const startTracking = useCallback(async () => {
    setLoading(true);

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
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    tracksStore.setTracking(false);
  }, [tracksStore]);

  return {isTracking, startTracking, cancelTracking, loading};
}
