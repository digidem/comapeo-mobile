import mapObject, {mapObjectSkip} from 'map-obj';
import {useCallback} from 'react';
import {
  watchPositionAsync,
  useForegroundPermissions,
  type LocationObject,
  Accuracy,
} from 'expo-location';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useFocusEffect} from '@react-navigation/native';

export function useMostAccurateLocationForObservation() {
  const value = usePersistedDraftObservation(store => store.value);
  const {updateObservationPosition} = useDraftObservation();

  const [permissions] = useForegroundPermissions();

  const isLocationManuallySet = !!value?.metadata?.manualLocation;

  useFocusEffect(
    useCallback(() => {
      if (!permissions || !permissions.granted || isLocationManuallySet) return;

      let ignore = false;
      const locationSubscriptionProm = watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
        },
        debounceLocation()(location => {
          if (ignore) return;
          updateObservationPosition({
            position: {
              mocked: location.mocked,
              coords: mapObject(location.coords, (key, val) =>
                val == null ? mapObjectSkip : [key, val],
              ),
              timestamp: new Date(location.timestamp).toISOString(),
            },
            manualLocation: false,
          });
        }),
      );

      // Should not happen because we are checking permissions above, but just in case
      locationSubscriptionProm.catch(() => {
        if (ignore) return;
        // TODO: We should probably set up an error boundary and throw
      });

      return () => {
        ignore = true;
        locationSubscriptionProm.then(sub => sub.remove());
      };
    }, [permissions, updateObservationPosition, isLocationManuallySet]),
  );
}

function debounceLocation() {
  let lastLocation: LocationObject | undefined;

  return function (callback: (location: LocationObject) => unknown) {
    return function (location: LocationObject) {
      if (!lastLocation) {
        lastLocation = location;
        callback(location);
        return;
      }
      const prevAccuracy = lastLocation.coords.accuracy;
      const newAccuracy = location.coords.accuracy;

      if (!newAccuracy) return;

      if (!prevAccuracy || newAccuracy < prevAccuracy) {
        lastLocation = location;
        callback(location);
        return;
      }
    };
  };
}
