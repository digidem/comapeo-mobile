import * as Location from 'expo-location';
import {useCallback} from 'react';
import {
  useTrackActions,
  useTrackState,
} from '../contexts/TrackStoreContext.tsx';
import {LOCATION_TASK_NAME} from '../sharedTypes/location.ts';
import {useNavigation} from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import {useLocationContext} from '../contexts/LocationContext';
import {toError} from '../utils/errors';

export function useTracking() {
  const {setTracking, addNewLocations, clearCurrentTrack} = useTrackActions();
  const navigation = useNavigation();
  const isTracking = useTrackState(state => state.isTracking);
  // TODO: Once use() is available, we can put this in the cancel tracking function
  const locationContext = useLocationContext();

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
    }).catch(err => {
      Sentry.captureException(err);
      setTracking(false);
      // @ts-expect-error - this is a typing issue, we are using the non-strongly typed hook as this can technically be used in any screen. But regardless of the screen, we want to show the error bottom sheet.
      navigation.navigate('ErrorBottomSheet', {
        error: toError(err, 'Tracking failed'),
      });
    });
  }, [isTracking, setTracking, navigation]);

  /**
   * Stops location tracking and finalizes the track.
   * Adds the current location to the track if it's new.
   * Should be called only after confirming tracking should end.
   */
  const endTracking = useCallback(() => {
    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(err => {
      Sentry.captureException(err);
    });

    const currentLocation = locationContext.getState().location;

    if (currentLocation?.coords) {
      const {latitude, longitude, accuracy} = currentLocation.coords;

      if (typeof accuracy === 'number' && accuracy <= 3) {
        addNewLocations([
          {
            latitude,
            longitude,
            timestamp: currentLocation.timestamp,
          },
        ]);
      }
    }

    setTracking(false);
  }, [addNewLocations, setTracking, locationContext]);

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
    endTracking,
    cancelTracking,
  };
}
