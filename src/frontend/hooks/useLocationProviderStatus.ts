import {useCallback, useRef, useSyncExternalStore} from 'react';
import {useLocationProviderStatusStore} from '../contexts/LocationProviderStatusContext';
import {shallowEqual} from 'react-intl/src/utils';

export function useLocationProviderStatus() {
  const providerStatusStore = useLocationProviderStatusStore();
  const previousState = useRef(providerStatusStore.getSnapshot());

  const getSnapshot = useCallback(() => {
    const newState = providerStatusStore.getSnapshot();

    if (previousState.current.error !== newState.error) {
      previousState.current = newState;
      return newState;
    }

    if (
      !(
        previousState.current.locationProviderStatus &&
        newState.locationProviderStatus
      )
    ) {
      previousState.current = newState;
      return newState;
    }

    if (
      !shallowEqual(
        previousState.current.locationProviderStatus,
        newState.locationProviderStatus,
      )
    ) {
      previousState.current = newState;
      return newState;
    }

    return previousState.current;
  }, [providerStatusStore]);

  return useSyncExternalStore(providerStatusStore.subscribe, getSnapshot);
}
