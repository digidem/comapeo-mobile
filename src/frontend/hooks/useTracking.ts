import * as Location from 'expo-location';
import {useCallback} from 'react';
import {
  useTrackActions,
  useTrackState,
} from '../contexts/TrackStoreContext.tsx';
import {LOCATION_TASK_NAME} from '../sharedTypes/location.ts';
import {useNavigation} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {useLocationState} from '../contexts/LocationContext';

export function useTracking() {
  const {setTracking, addNewLocations, clearCurrentTrack} = useTrackActions();
  const navigation = useNavigation();
  const isTracking = useTrackState(state => state.isTracking);
  const locationHistory = useTrackState(state => state.locationHistory);
  const distance = useTrackState(state => state.distance);
  const location = useLocationState(state => state.location);

  const startTracking = useCallback(() => {
    if (isTracking) {
      console.warn('Start tracking attempt while tracking already enabled');
      return;
    }
    setTracking(true);
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      activityType: Location.LocationActivityType.Fitness,
      distanceInterval: 1,
      timeInterval: 5000,
    }).catch(err => {
      Sentry.captureException(err);
      setTracking(false);
      // @ts-expect-error - this is a typing issue, we are using the non-strongly typed hook as this can technically be used in any screen. But regardless of the screen, we want to show the error bottom sheet.
      navigation.navigate('ErrorBottomSheet');
    });
  }, [isTracking, setTracking, navigation]);

  /**
   * @returns [distance and number of points] to determine next behavior.
   */
  const evaluateTrackStatus = useCallback(() => {
    const hasMovedEnough = distance > 0.001;
    const hasMultiplePoints = locationHistory.length > 1;
    return {hasMovedEnough, hasMultiplePoints};
  }, [distance, locationHistory]);
  /**
   * Stops location tracking and finalizes the track.
   * Adds the current location to the track if it's new.
   * Should be called only after confirming tracking should end.
   */
  const endTracking = useCallback(() => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(err => {
      Sentry.captureException(err);
    });

    if (location?.coords) {
      addNewLocations([
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp ?? Date.now(),
        },
      ]);
    }

    setTracking(false);
  }, [location, addNewLocations, setTracking]);

  const cancelTracking = useCallback(() => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(err => {
      Sentry.captureException(err);
    });

    setTracking(false);
    clearCurrentTrack();
  }, [setTracking, clearCurrentTrack]);

  return {
    isTracking,
    startTracking,
    evaluateTrackStatus,
    endTracking,
    cancelTracking,
  };
}
