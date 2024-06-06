import {useCallback, useRef, useSyncExternalStore} from 'react';
import CheapRuler from 'cheap-ruler';
import {type LocationObject} from 'expo-location';

import {
  LocationState,
  useLocationStore,
} from '../contexts/LocationStoreContext';

type Accuracy = 'better' | 'worse' | 'unchanged' | 'newBounds';

/**
 * Represents the changes in relevant location information since the last time the _hook subscriber_ accepted a new location update
 */
export interface ParameterChanges {
  /**
   * Distance change in meters
   */
  distance: number;
  /**
   * Amount of time elapsed in milliseconds
   */
  time: number;
  /**
   * Whether the accuracy has improved, become worse, or remained the same
   */
  accuracy: Accuracy;
}

export type ShouldAcceptUpdateCheck = (changes: ParameterChanges) => boolean;

export const DEFAULT_SHOULD_ACCEPT_UPDATE: ShouldAcceptUpdateCheck = ({
  distance,
  time,
}) => distance > 3 || time > 3000;

/**
 * Hook for subscribing to location updates and optionally providing a callback to control the frequency of stateful updates received by the hook subscriber
 *
 * @example
 * ```
 * // Outside your component...
 * function shouldAcceptLocationUpdate(changes) {
 *   // Accept location update if hook subscriber if it has been at least 5 seconds or 10 meters away since it accepted the last one
 *   return changes.time >= 5_000 || changes.distance >= 10 || accuracy === 'better'
 * }
 *
 *
 * // Inside your component...
 * const locationState = useLocation(shouldAcceptLocationUpdate);
 * ```
 */
export function useLocation(
  shouldAcceptUpdate: ShouldAcceptUpdateCheck = DEFAULT_SHOULD_ACCEPT_UPDATE,
) {
  const locationStore = useLocationStore();
  const prevState = useRef<LocationState>(locationStore.getSnapshot());

  const getSnapshot = useCallback(() => {
    const newState = locationStore.getSnapshot();

    // 1. If `error` field value is different, apply new state
    if (prevState.current?.error !== newState.error) {
      prevState.current = newState;
      return newState;
    }

    // 2. If `location` field is non-existent for previous or new state, apply new state
    // Former can technically happen on initialization (although unlikely)
    // Latter should not ever happen (but to make TypeScript happy)
    if (!(prevState.current.location && newState.location)) {
      if (!prevState.current.location && !newState.location) {
        return prevState.current;
      }
      prevState.current = newState;
      return newState;
    }

    const distanceChange = getDistance(
      prevState.current.location,
      newState.location,
    );

    const previousAccuracy = prevState.current.location.coords.accuracy;

    const newAccuracy = newState.location.coords.accuracy;

    const accuracy = getAccuracy(previousAccuracy, newAccuracy, distanceChange);

    const timeElapsed =
      newState.location.timestamp - prevState.current.location.timestamp;

    // 3. Provide the necessary information to let hook consumer decide if new state should be used
    if (
      shouldAcceptUpdate({
        distance: distanceChange,
        time: timeElapsed,
        accuracy,
      })
    ) {
      prevState.current = newState;
      return newState;
    } else {
      return prevState.current;
    }
  }, [locationStore, shouldAcceptUpdate]);

  return useSyncExternalStore(locationStore.subscribe, getSnapshot);
}

/**
 * Get the distance in meters between two LocationObject values
 *
 * @returns {number} Distance in meters
 */
function getDistance(
  previousLocation: LocationObject,
  currentLocation: LocationObject,
): number {
  const previous = getCoords(previousLocation);
  const current = getCoords(currentLocation);
  const ruler = new CheapRuler(previous[1], 'meters');
  return ruler.distance(current, previous);
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

function getAccuracy(
  previousAccuracy: number | null,
  newAccuracy: number | null,
  distance: number,
): Accuracy {
  if (previousAccuracy === null) {
    return newAccuracy === null ? 'unchanged' : 'better';
  }

  if (distance > previousAccuracy) {
    return 'newBounds';
  }

  if (newAccuracy === null) {
    return 'worse';
  }
  const difference = previousAccuracy - newAccuracy;
  if (difference === 0) return 'unchanged';
  return difference < 0 ? 'worse' : 'better';
}
