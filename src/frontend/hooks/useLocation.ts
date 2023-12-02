import {useFocusEffect} from '@react-navigation/native';
import CheapRuler from 'cheap-ruler';
import {
  watchPositionAsync,
  hasServicesEnabledAsync,
  type LocationObject,
  Accuracy,
} from 'expo-location';
import React from 'react';
import {
  PERMISSIONS,
  type PermissionResult,
  usePermissionContext,
  RESULTS,
} from '../contexts/PermissionsContext';

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

const MAX_RULER_LAT_DISPLACEMENT = 1;

// Timeout between location updates --> means location was probably turned off
// so we need to check it.
const LOCATION_TIMEOUT = 10000;

export function useLocation(options: LocationOptions) {
  const {minTimeInterval: timeInterval = 200, ...debounceOptions} = options;
  const [location, setLocation] = React.useState<LocationObject | undefined>();
  const {permissions} = usePermissionContext();

  const fineLocationPermissionResult = permissions[
    PERMISSIONS.ACCESS_FINE_LOCATION
  ] as PermissionResult;

  useFocusEffect(
    React.useCallback(() => {
      if (fineLocationPermissionResult !== RESULTS.GRANTED) return;

      let ignore = false;
      const LocationSubscriptionProm = watchPositionAsync(
        {accuracy: Accuracy.BestForNavigation},
        debounceLocation({
          ...debounceOptions,
        })(location => {
          if (ignore) return;
          setLocation(location);
        }),
      );
      return () => {
        ignore = true;
        LocationSubscriptionProm.then(sub => sub.remove());
      };
    }, [fineLocationPermissionResult]),
  );

  return {location, latLon: location ? getCoords(location) : undefined};
}

function debounceLocation({
  maxDistanceInterval,
  minDistanceInterval = 1,
  maxTimeInterval = 1000,
}: Omit<LocationOptions, 'minTimeInterval'>) {
  let lastLocation: LocationObject | undefined;
  let ruler: any;
  let rulerLat = 0;
  let timeout: ReturnType<typeof setTimeout>;
  return function (callback: (location: LocationObject | undefined) => any) {
    return function (location: LocationObject) {
      // The user can turn off location services via the quick settings dropdown
      // (swiping down from the top of their phone screen) without moving away
      // from the app. In this case the location will just stop updating and we
      // won't know why. If we haven't had a location update for a while, we check
      // on the provider status to see if location services are enabled, so that
      // we can update the state with the current status
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (!(await hasServicesEnabledAsync())) {
          lastLocation = undefined;
          callback(undefined);
          return;
        }
      }, LOCATION_TIMEOUT);
      if (!lastLocation) {
        lastLocation = location;
        callback(location);
        return;
      }
      const coords = getCoords(location);
      const lastCoords = getCoords(lastLocation);
      const rulerLatDisplacement = Math.abs(rulerLat - coords[1]);
      if (!ruler || rulerLatDisplacement > MAX_RULER_LAT_DISPLACEMENT) {
        rulerLat = coords[1];
        ruler = new CheapRuler(rulerLat, 'meters');
      }
      const distance = ruler.distance(coords, lastCoords);
      const time = location.timestamp - lastLocation.timestamp;
      if (
        distance > maxDistanceInterval ||
        (time > maxTimeInterval && distance > minDistanceInterval)
      ) {
        lastLocation = location;
        callback(location);
      }
    };
  };
}

function getCoords(location: LocationObject) {
  const {longitude, latitude} = location.coords;
  return [longitude, latitude];
}
