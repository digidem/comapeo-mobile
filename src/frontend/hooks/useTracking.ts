import * as Location from 'expo-location';
import {useCallback} from 'react';
import {
  useTrackActions,
  useTrackState,
} from '../contexts/TrackStoreContext.tsx';
import {LOCATION_TASK_NAME} from '../sharedTypes/location.ts';
import {useNavigation} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';

export function useTracking() {
  const {setTracking} = useTrackActions();
  const navigation = useNavigation();
  const isTracking = useTrackState(state => state.isTracking);
  const locationHistory = useTrackState(state => state.locationHistory);
  const distance = useTrackState(state => state.distance);

  const startTracking = useCallback(() => {
    if (isTracking) {
      console.warn('Start tracking attempt while tracking already enabled');
      return;
    }
    setTracking(true);
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      activityType: Location.LocationActivityType.Fitness,
    }).catch(err => {
      Sentry.captureException(err);
      setTracking(false);
      // @ts-expect-error - this is a typing issue, we are using the non-strongly typed hook as this can technically be used in any screen. But regardless of the screen, we want to show the error bottom sheet.
      navigation.navigate('ErrorBottomSheet');
    });
  }, [isTracking, setTracking, navigation]);
  /**
   * Cancels location tracking and stops background updates.
   * @returns {boolean} True if location history has more than one entry (track should be kept), false otherwise.
   */
  const cancelTracking = useCallback(() => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(err => {
      Sentry.captureException(err);
    });
    const hasMovedEnough = distance > 0.001;
    const hasMultiplePoints = locationHistory.length > 1;

    return {
      hasMovedEnough,
      hasMultiplePoints,
    };
  }, [locationHistory, distance]);

  return {
    isTracking,
    startTracking,
    cancelTracking,
  };
}
