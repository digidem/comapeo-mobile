import mapObject, {mapObjectSkip} from 'map-obj';
import {useEffect} from 'react';
import {
  watchPositionAsync,
  useForegroundPermissions,
  type LocationObject,
  Accuracy,
} from 'expo-location';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {useLocationState} from '../../contexts/LocationContext';

export function useMostAccurateLocationForObservation() {
  const value = usePersistedDraftObservation(store => store.value);
  const {updateObservationPosition} = useDraftObservation();

  const [permissions] = useForegroundPermissions();

  const providerStatus = useLocationState(store => store.providerStatus);
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

  useEffect(() => {
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
  }, [permissions, updateObservationPosition, isLocationManuallySet]);
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
