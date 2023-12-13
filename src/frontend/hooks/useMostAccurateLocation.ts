import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {
  watchPositionAsync,
  useForegroundPermissions,
  type LocationObject,
  Accuracy,
} from 'expo-location';

interface LocationState {
  location: LocationObject | undefined;
  error: Error | undefined;
}

export function useMostAccurateLocation(): LocationState {
  const [location, setLocation] = useState<LocationState>({
    location: undefined,
    error: undefined,
  });

  const [permissions] = useForegroundPermissions();

  useFocusEffect(
    useCallback(() => {
      if (!permissions || !permissions.granted) return;

      let ignore = false;
      const locationSubscriptionProm = watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
        },
        debounceLocation()(location => {
          if (ignore) return;
          setLocation({location, error: undefined});
        }),
      );

      // Should not happen because we are checking permissions above, but just in case
      locationSubscriptionProm.catch(error => {
        if (ignore) return;
        setLocation(({location}) => {
          return {location, error};
        });
      });

      return () => {
        ignore = true;
        locationSubscriptionProm.then(sub => sub.remove());
      };
    }, [permissions]),
  );

  return location;
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

/**
 * For a LocationObject, get the lon,lat tuple
 *
 * @returns [longitude, latitude]
 */
export function getCoords(location: LocationObject): [number, number] {
  const {longitude, latitude} = location.coords;
  return [longitude, latitude];
}
