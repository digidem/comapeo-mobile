import React from 'react';
import {
  type LocationProviderStatus,
  getProviderStatusAsync,
  useForegroundPermissions,
} from 'expo-location';

// How frequently to poll the location provider status
const POLL_PROVIDER_STATUS_INTERVAL = 10_000; // 10 seconds

function createWatchLocationProviderStatus() {
  const listeners = new Set<(status: LocationProviderStatus) => void>();
  let intervalId: ReturnType<typeof setInterval> | undefined;

  return function watchLocationProviderStatus(
    listener: (status: LocationProviderStatus) => void,
  ) {
    if (!intervalId) {
      intervalId = setInterval(
        checkProviderStatus,
        POLL_PROVIDER_STATUS_INTERVAL,
      );
    }
    listeners.add(listener);
    // Immediately call the listener with the current status
    getProviderStatusAsync()
      .then(status => listener(status))
      .catch(noop);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  };

  function checkProviderStatus() {
    getProviderStatusAsync()
      .then(status => {
        for (const listener of listeners) {
          listener(status);
        }
      })
      .catch(noop);
  }
}

const watchLocationProviderStatus = createWatchLocationProviderStatus();

export function useLocationProviderStatus() {
  const [providerStatus, setProviderStatus] = React.useState<
    LocationProviderStatus | undefined
  >(undefined);
  const [permissions] = useForegroundPermissions();

  React.useEffect(() => {
    if (!permissions || !permissions.granted) return;
    let ignore = false;
    const unsubscribe = watchLocationProviderStatus(status => {
      if (ignore) return;
      setProviderStatus(status);
    });
    return () => {
      unsubscribe();
      ignore = true;
    };
  }, [permissions]);

  return providerStatus;
}

function noop() {}
