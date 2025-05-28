import {useLocationState} from '../../contexts/LocationContext';
import {GPSPillUI} from './GPSPillUI';
import {getLocationStatus} from '../../lib/utils';

export const GPSPill = ({onPress}: {onPress: () => void}) => {
  const location = useLocationState(store => store.location);
  const locationProviderStatus = useLocationState(
    store => store.providerStatus,
  );

  return (
    <GPSPillUI
      {...getLocationStatus({
        gpsAvailable: !!locationProviderStatus.gpsAvailable,
        locationServicesEnabled: locationProviderStatus.locationServicesEnabled,
        location: location,
      })}
      onPress={onPress}
    />
  );
};
