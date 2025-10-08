import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {Divider} from '../../sharedComponents/Divider';
import {LocationView} from '../../sharedComponents/Editor/LocationView';
import {useMostAccurateLocationForObservation} from './useMostAccurateLocationForObservation';

export const LiveLocationView = () => {
  useMostAccurateLocationForObservation();
  const position = usePersistedDraftObservation(
    store => store.value?.metadata?.position,
  );

  return position ? (
    <>
      <Divider />
      <LocationView
        lat={position?.coords?.latitude}
        lon={position?.coords?.longitude}
        accuracy={position?.coords?.accuracy}
      />
    </>
  ) : null;
};
