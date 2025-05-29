import {useMutation} from '@tanstack/react-query';
import * as Location from 'expo-location';
import {LOCATION_TASK_NAME} from '../sharedTypes/location';

export function useStartLocationUpdates() {
  return useMutation({
    mutationFn: () =>
      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        activityType: Location.LocationActivityType.Fitness,
      }),
  });
}
