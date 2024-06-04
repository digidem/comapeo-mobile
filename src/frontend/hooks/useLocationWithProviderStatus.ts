import {shallowEqual} from 'react-intl/src/utils';
import {
  DEFAULT_SHOULD_ACCEPT_UPDATE,
  ShouldAcceptUpdateCheck,
  useLocation,
} from './useLocation';
import {useLocationProviderStatus} from './useLocationProviderStatus';
import {useRef} from 'react';

export function useLocationWithProviderStatus(
  shouldAcceptUpdate: ShouldAcceptUpdateCheck = DEFAULT_SHOULD_ACCEPT_UPDATE,
) {
  const providerStatus = useLocationProviderStatus();
  const prevProviderStatus = useRef(providerStatus);

  const location = useLocation(
    // if gps not available, do not update location state
    !providerStatus.locationProviderStatus?.gpsAvailable
      ? () => false
      : // if gps was not avaialable and is now avaialble, get location right away
        !prevProviderStatus.current.locationProviderStatus?.gpsAvailable &&
          providerStatus.locationProviderStatus?.gpsAvailable
        ? () => true
        : // otherwise update based on shoudAcceptUpdate params
          shouldAcceptUpdate,
  );

  if (!shallowEqual(providerStatus, prevProviderStatus.current)) {
    prevProviderStatus.current = providerStatus;
  }

  return {
    locationState: !providerStatus.locationProviderStatus?.gpsAvailable
      ? null
      : location,
    providerStatusState: providerStatus,
  };
}
