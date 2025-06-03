import {useMutation} from '@tanstack/react-query';
import * as Location from 'expo-location';
import {LOCATION_TASK_NAME} from '../sharedTypes/location';
import {useTrackActions} from '../contexts/TrackStoreContext';

export function useStartLocationUpdates() {
  const {initializeTrackTime} = useTrackActions();
  return useMutation({
    mutationFn: () => {
      initializeTrackTime();
      return Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        activityType: Location.LocationActivityType.Fitness,
      });
    },
  });
}
