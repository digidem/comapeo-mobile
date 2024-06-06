import React, {createContext, useContext, useState} from 'react';
import {
  type LocationProviderStatus,
  getProviderStatusAsync,
} from 'expo-location';

// How frequently to poll the location provider status
const POLL_PROVIDER_STATUS_INTERVAL = 10_000; // 10 seconds

const LocationProviderStatusStoreContext =
  createContext<LocationProviderStatusStore | null>(null);

export function LocationProviderStatusStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(() => new LocationProviderStatusStore());

  return (
    <LocationProviderStatusStoreContext.Provider value={store}>
      {children}
    </LocationProviderStatusStoreContext.Provider>
  );
}

export function useLocationProviderStatusStore() {
  const store = useContext(LocationProviderStatusStoreContext);

  if (!store) {
    throw new Error(
      'No LocationProviderStatusStore set, use LocationProviderStatusStoreProvider to set one',
    );
  }

  return store;
}

export type LocationProviderStatusState = {
  locationProviderStatus: LocationProviderStatus | null;
  error: Error | null;
};

class LocationProviderStatusStore {
  #locationProviderStatusSubscription: NodeJS.Timeout | null = null;
  #subscribers = new Set<() => void>();
  #state: LocationProviderStatusState = {
    locationProviderStatus: null,
    error: null,
  };

  constructor() {
    this.checkProviderStatus = this.checkProviderStatus.bind(this);
    this.init();
  }

  async init() {
    try {
      if (this.#locationProviderStatusSubscription) return;
      this.checkProviderStatus();
      this.#locationProviderStatusSubscription = setInterval(
        this.checkProviderStatus,
        POLL_PROVIDER_STATUS_INTERVAL,
      );
    } catch (err) {
      if (err instanceof Error) {
        this.#state = {
          locationProviderStatus: this.#state.locationProviderStatus,
          error: err,
        };
      }

      for (const s of this.#subscribers) {
        s();
      }
    }
  }

  updateSubscribers() {
    for (const s of this.#subscribers) {
      s();
    }
  }

  checkProviderStatus() {
    getProviderStatusAsync()
      .then(status => {
        this.#state = {locationProviderStatus: status, error: null};
        this.updateSubscribers();
      })
      .catch(error => {
        this.#state.error = error;
        this.updateSubscribers();
      });
  }

  getSnapshot = (): LocationProviderStatusState => {
    return this.#state;
  };

  subscribe = (cb: () => void) => {
    this.#subscribers.add(cb);

    if (!this.#locationProviderStatusSubscription) {
      this.init().catch(err => {
        console.log(err);
      });
    }

    return () => {
      this.#subscribers.delete(cb);
      if (
        this.#subscribers.size === 0 &&
        this.#locationProviderStatusSubscription
      ) {
        clearInterval(this.#locationProviderStatusSubscription);
      }
    };
  };
}
