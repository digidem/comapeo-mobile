import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {useCallback, useState} from 'react';
import {useCurrentTrackStore} from './useCurrentTrackStore';
import React from 'react';
import {FullLocationData} from '../../sharedTypes/location';
import {useGPSModalContext} from '../../contexts/GPSModalContext';

export const LOCATION_TASK_NAME = 'background-location-task';

type LocationCallbackInfo = {
  data: {locations: FullLocationData[]} | null;
  error: TaskManager.TaskManagerError | null;
};

export function useTracking() {
  const {bottomSheetRef} = useGPSModalContext();
  const [loading, setLoading] = useState(false);
  const addNewLocations = useCurrentTrackStore(state => state.addNewLocations);
  const setTracking = useCurrentTrackStore(state => state.setTracking);
  const isTracking = useCurrentTrackStore(state => state.isTracking);

  React.useEffect(() => {
    TaskManager.defineTask(
      LOCATION_TASK_NAME,
      ({data, error}: LocationCallbackInfo) => {
        if (error) {
          console.error(
            'Error while processing location update callback',
            error,
          );
        }
        if (data?.locations) {
          addNewLocations(
            data.locations.map(loc => ({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              timestamp: loc.timestamp,
            })),
          );
        }
      },
    );
  }, []);

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
