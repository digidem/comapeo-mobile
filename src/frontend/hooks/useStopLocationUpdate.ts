import {useMutation} from '@tanstack/react-query';
import * as Location from 'expo-location';
import {LOCATION_TASK_NAME} from '../sharedTypes/location';

export function useStopLocationUpdates() {
  return useMutation({
    mutationFn: () => Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME),
  });
}
