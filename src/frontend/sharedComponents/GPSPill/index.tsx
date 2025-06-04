import {useLocationState} from '../../contexts/LocationContext';
import {getLocationStatus} from '../../lib/utils';
import {GPSPillUI} from './GPSPillUI';

export const GPSPill = ({onPress}: {onPress: () => void}) => {
  const locationProviderStatus = useLocationState(
    store => store.providerStatus,
  );

  const location = useLocationState(store => store.location);
  return (
    <GPSPillUI
      onPress={onPress}
      {...getLocationStatus({
        providerStatus: locationProviderStatus,
        location: location,
      })}
    />
  );
};
