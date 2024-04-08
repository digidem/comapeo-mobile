import {useCallback, useRef, useSyncExternalStore} from 'react';
import CheapRuler from 'cheap-ruler';
import {type LocationObject} from 'expo-location';

import {useLocationStore} from '../contexts/LocationStoreContext';

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
}

type ShouldAcceptUpdateCheck = (changes: ParameterChanges) => boolean;

const DEFAULT_SHOULD_ACCEPT_UPDATE: ShouldAcceptUpdateCheck = () => true;

/**
 * Hook for subscribing to location updates and optionally providing a callback to control the frequency of stateful updates received by the hook subscriber
 *
 * @example
 * ```
 * // Outside your component...
 * function shouldAcceptLocationUpdate(changes) {
 *   // Accept location update if hook subscriber if it has been at least 5 seconds or 10 meters away since it accepted the last one
 *   return changes.time >= 5_000 || changes.distance >= 10
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

  const prevState = useRef(locationStore.getSnapshot());

  const getSnapshot = useCallback(() => {
    const newState = locationStore.getSnapshot();

    // 1. If `error` field value is different, apply new state
    if (prevState.current.error !== newState.error) {
      prevState.current = newState;
      return newState;
    }

    // 2. If `location` field is non-existent for previous or new state, apply new state
    // Former can technically happen on initialization (although unlikely)
    // Latter should not ever happen (but to make TypeScript happy)
    if (!(prevState.current.location && newState.location)) {
      prevState.current = newState;
      return newState;
    }

    const distanceChange = getDistance(
      prevState.current.location,
      newState.location,
    );

    const timeElapsed =
      newState.location.timestamp - prevState.current.location.timestamp;

    // 3. Provide the necessary information to let hook consumer decide if new state should be used
    if (
      shouldAcceptUpdate({
        distance: distanceChange,
        time: timeElapsed,
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

/**
 * Alternative implementation based on functional state update syntax of `useState()`
 * Seems to work quite effectively but feels a little "impure"?
 */
// export function useLocation(
//   shouldAcceptUpdate: ShouldAcceptUpdateCheck = DEFAULT_SHOULD_ACCEPT_UPDATE,
// ) {
//   const locationStore = useLocationStore();

//   const [state, setState] = useState(() => locationStore.getSnapshot());

//   useEffect(() => {
//     const unsubscribe = locationStore.subscribe(() => {
//       setState(prevState => {
//         const newState = locationStore.getSnapshot();

//         // 1. If `error` field value is different, apply new state
//         if (prevState.error !== newState.error) return newState;

//         // 2. If `location` field is non-existent for previous or new state, apply new state
//         // Former can technically happen on initialization (although unlikely)
//         // Latter should not ever happen (but to make TypeScript happy)
//         if (!(prevState.location && newState.location)) return newState;

//         const distanceChange = getDistance(
//           prevState.location,
//           newState.location,
//         );

//         const timeElapsed =
//           newState.location.timestamp - prevState.location.timestamp;

//         // 3. Provide the necessary information to let hook consumer decide if new state should be used
//         return shouldAcceptUpdate({
//           distance: distanceChange,
//           time: timeElapsed,
//         })
//           ? newState
//           : prevState;
//       });
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [locationStore, shouldAcceptUpdate]);

//   return state;
// }
