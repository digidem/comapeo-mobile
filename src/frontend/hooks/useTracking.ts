import * as Location from 'expo-location';
import {useCallback} from 'react';
import {
  useTrackActions,
  useTrackState,
} from '../contexts/TrackStoreContext.tsx';
import {LOCATION_TASK_NAME} from '../sharedTypes/location.ts';
import {useNavigation} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {calculateTotalDistance} from '../utils/distance.ts';

export function useStartStopTracks() {
  const {addNewLocations} = useTrackActions();
  const locationHistory = useTrackState(state => state.locationHistory);
  const navigation = useNavigation();

  const startTracking = useCallback(
    (initialLocation: Location.LocationObject) => {
      //Manually insert current location as the first point in the track
      addNewLocations([
        {
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          timestamp: initialLocation.timestamp,
        },
      ]);

      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        activityType: Location.LocationActivityType.Fitness,
      }).catch(err => {
        Sentry.captureException(err);
        // @ts-expect-error - this is a typing issue, we are using the non-strongly typed hook as this can technically be used in any screen. But regardless of the screen, we want to show the error bottom sheet.
        navigation.navigate('ErrorBottomSheet');
      });
    },
    [navigation, addNewLocations],
  );
  /**
   * Cancels location tracking and stops background updates.
   * @returns {number} returns the total distance recorded in meters.
   */
  const endTracking = useCallback(() => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(err => {
      Sentry.captureException(err);
    });

    const totalDistanceRecorded =
      calculateTotalDistance(locationHistory) * 1000; // Convert to meters

    return totalDistanceRecorded;
  }, [locationHistory]);

  return {
    endTracking,
    startTracking,
  };
}

export const useCurrentTrackState = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  return {
    hasActiveTrack: locationHistory.length > 0,
    totalDistance: calculateTotalDistance(locationHistory) * 1000, // Convert to meters
    locationHistory,
  };
};
