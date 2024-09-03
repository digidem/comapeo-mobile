import {useFocusEffect} from '@react-navigation/native';
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
import {useLocationProviderStatus} from '../../hooks/useLocationProviderStatus';
import type {Position} from '../../sharedTypes';

export function useMostAccurateLocationForObservation() {
  const value = usePersistedDraftObservation(store => store.value);
  const {updateObservationPosition} = useDraftObservation();

  const [permissions] = useForegroundPermissions();

  const providerStatus = useLocationProviderStatus();
  const locationServicesTurnedOff =
    providerStatus && !providerStatus.locationServicesEnabled;

  const isLocationManuallySet = !!value?.metadata?.manualLocation;

  // If location services are turned off (and the observation location is not manually set),
  // we want to immediately update the draft so that this hook does not return a stale position
  if (
    locationServicesTurnedOff &&
    value?.metadata?.position &&
    !isLocationManuallySet
  ) {
    updateObservationPosition({position: undefined, manualLocation: false});
  }

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

          const position: Position = {mocked: false};
          if (location) {
            position.coords = mapObject(location.coords, (key, val) =>
              val == null ? mapObjectSkip : [key, val],
            );
            position.timestamp = new Date(location.timestamp).toISOString();
          }

          updateObservationPosition({
            position,
            manualLocation: false,
          });
        }),
      );

      // Should not happen because we are checking permissions above, but just in case
      locationSubscriptionProm.catch(error => {
        if (ignore) return;
        // We should probably set up an error boundary and throw
      });

      return () => {
        ignore = true;
        locationSubscriptionProm.then(sub => sub.remove());
      };
    }, [permissions, updateObservationPosition, isLocationManuallySet]),
  );

  return value?.metadata?.position;
}

function debounceLocation() {
  let lastLocation: LocationObject | undefined;

  return function (callback: (location: LocationObject | undefined) => any) {
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
