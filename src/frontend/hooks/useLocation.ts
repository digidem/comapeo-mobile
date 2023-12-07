import {useFocusEffect} from '@react-navigation/native';
import CheapRuler from 'cheap-ruler';
import {
  watchPositionAsync,
  hasServicesEnabledAsync,
  useForegroundPermissions,
  type LocationObject,
  Accuracy,
} from 'expo-location';
import React from 'react';

interface LocationOptions {
  /** Only update location if it has changed by at least this distance in meters (or maxTimeInterval has passed) */
  maxDistanceInterval: number;
  /** If the location has updated by less than this distance in meters, don't update even if maxTimeInterval has passed */
  minDistanceInterval?: number;
  /** Minimum time to wait between each update in milliseconds. */
  minTimeInterval?: number;
  /** Maximum time to wait between each update in milliseconds - updates could take longer than this, but if a new location is available we will always get it after this time */
  maxTimeInterval?: number;
}

interface LocationState {
  location: LocationObject | undefined;
  error: Error | undefined;
}

// Timeout between location updates --> means location was probably turned off
// so we need to check it.
const LOCATION_TIMEOUT = 10000;

export function useLocation({
  minDistanceInterval: distanceInterval = 1,
  ...debounceOptions
}: LocationOptions): LocationState {
  const [location, setLocation] = React.useState<LocationState>({
    location: undefined,
    error: undefined,
  });

  const [permissions] = useForegroundPermissions();

  useFocusEffect(
    React.useCallback(() => {
      if (!permissions || !permissions.granted) return;

      let ignore = false;
      const locationSubscriptionProm = watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          distanceInterval,
        },
        debounceLocation(debounceOptions)(location => {
          if (ignore) return;
          setLocation({location, error: undefined});
        }),
      );

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
    }, [permissions, debounceOptions]),
  );

  return location;
}

function debounceLocation({
  maxDistanceInterval,
  maxTimeInterval = 1000,
  minTimeInterval = 200,
}: Omit<LocationOptions, 'minDistanceInterval'>) {
  let lastLocation: LocationObject | undefined;
  let interval: ReturnType<typeof setInterval>;

  return function (callback: (location: LocationObject | undefined) => any) {
    return function (location: LocationObject) {
      // The user can turn off location services via the quick settings dropdown
      // (swiping down from the top of their phone screen) without moving away
      // from the app. In this case the location will just stop updating and we
      // won't know why. If we haven't had a location update for a while, we check
      // on the provider status to see if location services are enabled, so that
      // we can update the state with the current status
      if (interval) clearInterval(interval);
      interval = setInterval(async () => {
        if (!(await hasServicesEnabledAsync())) {
          lastLocation = undefined;
          callback(undefined);
          clearInterval(interval);
          return;
        }
      }, LOCATION_TIMEOUT);

      if (!lastLocation) {
        lastLocation = location;
        callback(location);
        return;
      }
      const timeElapsed = location.timestamp - lastLocation.timestamp;

      // expo's Location.watchPositionAsync has a `timeInterval` property that does this BUT it is not compatible with iOS, that is why we are manually calculating it here
      if (timeElapsed < minTimeInterval) return;

      const coords = getCoords(location);
      const lastCoords = getCoords(lastLocation);
      const ruler = new CheapRuler(lastCoords[1], 'meters');
      const distance = ruler.distance(coords, lastCoords);
      if (distance > maxDistanceInterval || timeElapsed > maxTimeInterval) {
        lastLocation = location;
        callback(location);
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
