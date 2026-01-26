import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {Divider} from '../../sharedComponents/Divider';
import {LocationView} from '../../sharedComponents/LocationView';
import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';

export const LiveLocationView = () => {
  useMostAccurateLocationForObservation();
  const lat = usePersistedDraftObservation(store => store.value?.lat);
  const lon = usePersistedDraftObservation(store => store.value?.lon);
  const accuracy = usePersistedDraftObservation(
    store => store.value?.metadata?.position?.coords.accuracy,
  );

  return lat && lon ? (
    <>
      <Divider />
      <LocationView lat={lat} lon={lon} accuracy={accuracy} />
    </>
  ) : null;
};
