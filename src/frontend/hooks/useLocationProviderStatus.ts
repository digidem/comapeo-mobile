import {useSyncExternalStore} from 'react';
import {useLocationProviderStatusStore} from '../contexts/LocationProviderStatusContext';

export function useLocationProviderStatus() {
  const providerStatusStore = useLocationProviderStatusStore();

  return useSyncExternalStore(
    providerStatusStore.subscribe,
    providerStatusStore.getSnapshot,
  );
}
