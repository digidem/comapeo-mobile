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
    [],
  );

  const startTracking = useCallback(async () => {
    TaskManager.defineTask(LOCATION_TASK_NAME, addNewTrackLocations);

    if (isTracking) {
      console.warn('Start tracking attempt while tracking already enabled');
      return;
    }
    const requestForeground = Location.requestForegroundPermissionsAsync;
    const requestBackground = Location.requestBackgroundPermissionsAsync;

    const foregroundRequest = await requestForeground();
    if (foregroundRequest.granted) {
      const backgroundRequest = await requestBackground();
      if (backgroundRequest.granted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          activityType: Location.LocationActivityType.Fitness,
        });
        tracksStore.setTracking(true);
      }
    }
  }, []);

  const cancelTracking = useCallback(async () => {
    await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    tracksStore.setTracking(false);
  }, []);
  return {isTracking, startTracking, cancelTracking};
}
