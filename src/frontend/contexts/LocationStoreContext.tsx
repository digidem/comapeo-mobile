import React, {createContext, useContext, useState} from 'react';
import {
  Accuracy,
  LocationObject,
  LocationSubscription,
  useForegroundPermissions,
  watchPositionAsync,
} from 'expo-location';

const LocationStoreContext = createContext<LocationStore | null>(null);

// TODO: Return undefined when provider status changes to unavailable
export function LocationStoreProvider({children}: {children: React.ReactNode}) {
  const [store] = useState(() => new LocationStore());

  const [locationPermissions] = useForegroundPermissions();

  if (locationPermissions?.granted) {
    store.init();
  }

  return (
    <LocationStoreContext.Provider value={store}>
      {children}
    </LocationStoreContext.Provider>
  );
}

export function useLocationStore() {
  const store = useContext(LocationStoreContext);

  if (!store) {
    throw new Error(
      'No LocationStore set, use LocationStoreProvider to set one',
    );
  }

  return store;
}

export interface LocationState {
  location: LocationObject | null;
  error: Error | null;
}

export class LocationStore {
  #locationSubscription: LocationSubscription | null = null;
  #subscribers = new Set<() => void>();
  #state: LocationState = {
    location: null,
    error: null,
  };

  /**
   * Initialize position watching. Permissions handling should be done before calling this.
   */
  init = async () => {
    if (this.#locationSubscription) return;

    try {
      this.#locationSubscription = await watchPositionAsync(
        {accuracy: Accuracy.BestForNavigation},
        location => {
          this.#state = {error: null, location};

          for (const s of this.#subscribers) {
            s();
          }
        },
      );
    } catch (err) {
      if (err instanceof Error) {
        this.#state = {location: this.#state.location, error: err};
      }

      for (const s of this.#subscribers) {
        s();
      }
    }
  };

  getSnapshot = (): LocationState => {
    return this.#state;
  };

  subscribe = (cb: () => void) => {
    this.#subscribers.add(cb);

    if (!this.#locationSubscription) {
      this.init().catch(err => {
        console.log(err);
      });
    }

    return () => {
      this.#subscribers.delete(cb);
      if (this.#subscribers.size === 0) {
        this.#locationSubscription?.remove();
        this.#locationSubscription = null;
      }
    };
  };
}
