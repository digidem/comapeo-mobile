import {
  watchPositionAsync,
  type LocationObject,
  Accuracy,
  LocationSubscription,
  useForegroundPermissions,
} from 'expo-location';
import {useCallback, useRef, useSyncExternalStore} from 'react';
import CheapRuler from 'cheap-ruler';
import {useLocationProviderStatus} from './useLocationProviderStatus';

interface LocationOptions {
  /** Only update location if it has changed by at least this distance in meters (or maxTimeInterval has passed) */
  maxDistanceInterval: number;
  /** Minimum time to wait between each update in milliseconds. */
  minTimeInterval?: number;
  /** Maximum time to wait between each update in milliseconds - updates could take longer than this, but if a new location is available we will always get it after this time */
  maxTimeInterval?: number;
}

export function useLocationStore({
  maxDistanceInterval,
  maxTimeInterval = 1000,
  minTimeInterval = 200,
}: LocationOptions) {
  const [permissions] = useForegroundPermissions();
  const providerStatus = useLocationProviderStatus();
  const lastLocation = useRef(locationStore.getLocation());

  locationStore.manageLocationAvailable(
    !!(providerStatus?.locationServicesEnabled && permissions?.granted),
  );

  const filter = useCallback(
    (snapShotLocation: LocationObject | undefined) => {
      if (!snapShotLocation) {
        return undefined;
      }
      if (!lastLocation.current) {
        lastLocation.current = snapShotLocation;
        return snapShotLocation;
      }
      const timeElapsed =
        snapShotLocation.timestamp - lastLocation.current.timestamp;

      if (timeElapsed < minTimeInterval) {
        return lastLocation.current;
      }

      const coords = getCoords(snapShotLocation);
      const lastCoords = getCoords(lastLocation.current);
      const ruler = new CheapRuler(lastCoords[1], 'meters');
      const distance = ruler.distance(coords, lastCoords);
      if (distance > maxDistanceInterval || timeElapsed > maxTimeInterval) {
        lastLocation.current = snapShotLocation;
        return snapShotLocation;
      }

      return lastLocation.current;
    },
    [maxDistanceInterval, maxTimeInterval, minTimeInterval],
  );

  return useSyncExternalStore(locationStore.subscribe.bind(locationStore), () =>
    filter(locationStore.getLocation()),
  );
}

type Listener = () => void;

class LocationStore {
  private static instance: LocationStore | null = null; // Static instance for singleton behavior
  private location: LocationObject | undefined; // Store the current location
  private listeners: Set<Listener> = new Set(); // Set of listeners for subscription
  private subscription: Promise<LocationSubscription> | null = null; // Location subscription reference

  private constructor() {
    this.listeners = new Set(); // Initialize listeners set
    this.location = undefined; // Initialize location as undefined
  }

  // Singleton instance accessor
  static getInstance(): LocationStore {
    if (!LocationStore.instance) {
      LocationStore.instance = new LocationStore(); // Create a new instance if none exists
    }
    return LocationStore.instance;
  }

  // We do not want to return a stale location. So if permissions changes, update location to be undefined and turn off subscription
  manageLocationAvailable(isAvailable: boolean) {
    if (!isAvailable) {
      this.stopWatching();
      this.location = undefined;
      this.listeners.forEach(listener => listener());
      return;
    }
    if (!this.subscription) this.startWatching();
  }

  // Subscribe to location changes
  subscribe(listener: Listener) {
    if (!this.listeners) {
      this.listeners = new Set();
    }
    this.listeners.add(listener);
    if (!this.subscription) this.startWatching();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopWatching(); // Stop watching when no listeners remain
      }
    };
  }

  // Get the current location
  getLocation(): LocationObject | undefined {
    return this.location;
  }

  // Start watching for location changes
  private startWatching() {
    this.subscription = watchPositionAsync(
      {accuracy: Accuracy.BestForNavigation},
      location => {
        this.location = location;
        this.listeners.forEach(listener => listener());
      },
    );
  }

  // Stop watching for location changes
  private stopWatching(): void {
    if (this.subscription) {
      this.subscription.then(sub => sub.remove());
      this.subscription = null;
    }
  }
}

const locationStore = LocationStore.getInstance();

/**
 * For a LocationObject, get the lon,lat tuple
 *
 * @returns [longitude, latitude]
 */
export function getCoords(locationObj: LocationObject): [number, number] {
  const {longitude, latitude} = locationObj.coords;
  return [longitude, latitude];
}
