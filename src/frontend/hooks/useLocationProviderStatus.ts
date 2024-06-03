import React from 'react';
import {
  type LocationProviderStatus,
  getProviderStatusAsync,
  useForegroundPermissions,
} from 'expo-location';
import {useQueryClient} from '@tanstack/react-query';
import noop from '../lib/noop';

// How frequently to poll the location provider status
const POLL_PROVIDER_STATUS_INTERVAL = 10_000; // 10 seconds

export function useLocationProviderStatus() {
  const [providerStatus, setProviderStatus] = React.useState<
    LocationProviderStatus | undefined
  >(undefined);
  const [permissions] = useForegroundPermissions();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!permissions || !permissions.granted) return;
    let ignore = false;
    async function checkProviderStatus() {
      getProviderStatusAsync()
        .then(status => {
          if (ignore) return;
          if (!status.locationServicesEnabled)
            queryClient.invalidateQueries({queryKey: ['lastLocation']});
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
  }, [permissions, queryClient]);

  return providerStatus;
}
