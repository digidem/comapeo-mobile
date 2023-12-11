import React from 'react';
import {
  type LocationProviderStatus,
  getProviderStatusAsync,
  watchPositionAsync,
  useForegroundPermissions,
} from 'expo-location';

// How frequently to poll the location provider status
const POLL_PROVIDER_STATUS_INTERVAL = 10_000; // 10 seconds

export function useLocationProviderStatusPolling() {
  const [providerStatus, setProviderStatus] = React.useState<
    LocationProviderStatus | undefined
  >(undefined);
  const [permissions] = useForegroundPermissions();

  React.useEffect(() => {
    if (!permissions || !permissions.granted) return;
    let ignore = false;
    function checkProviderStatus() {
      getProviderStatusAsync()
        .then(status => {
          if (ignore) return;
          setProviderStatus(status);
        })
        // Shouldn't happen because we check permissions.granted above, but just in case
        .catch(noop);
    }
    checkProviderStatus();
    const intervalId = setInterval(
      checkProviderStatus,
      POLL_PROVIDER_STATUS_INTERVAL,
    );
    return () => {
      clearInterval(intervalId);
      ignore = true;
    };
  }, [permissions]);

  return providerStatus;
}

// How long without a position update before we check the location provider status
const PROVIDER_STATUS_TIMEOUT = 10_000; // 10 seconds

export function useLocationProviderStatusWatch() {
  const [providerStatus, setProviderStatus] = React.useState<
    LocationProviderStatus | undefined
  >(undefined);
  const [permissions] = useForegroundPermissions();

  React.useEffect(() => {
    if (!permissions || !permissions.granted) return;
    let ignore = false;
    function checkProviderStatus() {
      getProviderStatusAsync()
        .then(status => {
          if (ignore) return;
          setProviderStatus(status);
        })
        // Shouldn't happen because we check permissions.granted above, but just in case
        .catch(noop);
    }
    checkProviderStatus();
    let timeoutId = setTimeout(checkProviderStatus, PROVIDER_STATUS_TIMEOUT);
    const locationSubscriptionProm = watchPositionAsync({}, () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkProviderStatus, PROVIDER_STATUS_TIMEOUT);
    });
    // Shouldn't happen because we check permissions.granted above, but just in case
    locationSubscriptionProm.catch(noop);
    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [permissions]);

  return providerStatus;
}

function noop() {}
