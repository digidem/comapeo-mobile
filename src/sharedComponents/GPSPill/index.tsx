import {useLocationState} from '../../contexts/LocationContext';
import {useUnitSystem} from '../../contexts/UnitSystemStoreContext';
import {getLocationStatus} from '../../lib/utils';
import {GPSPillUI} from './GPSPillUI';

export const GPSPill = ({onPress}: {onPress: () => void}) => {
  const locationProviderStatus = useLocationState(
    store => store.providerStatus,
  );
  const location = useLocationState(store => store.location);
  const unitSystem = useUnitSystem();

  return (
    <GPSPillUI
      testID="MAP.gps-pill"
      accessibilityLabel="Open GPS Modal."
      onPress={onPress}
      unitSystem={unitSystem}
      {...getLocationStatus({
        providerStatus: locationProviderStatus,
        location: location,
      })}
    />
  );
};
