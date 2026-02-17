import {useDraftObservationState} from '../../contexts/DraftObservationContext';

import {Divider} from '../../sharedComponents/Divider';
import {LocationView} from '../../sharedComponents/LocationView';

export const LiveLocationView = () => {
  const lat = useDraftObservationState(store => store.value?.lat);
  const lon = useDraftObservationState(store => store.value?.lon);
  const accuracy = useDraftObservationState(
    store => store.value?.metadata?.position?.coords.accuracy,
  );

  return lat && lon ? (
    <>
      <Divider />
      <LocationView lat={lat} lon={lon} accuracy={accuracy} />
    </>
  ) : null;
};
