import {useObservationContext} from '../contexts/ObservationsContext';

export const useObservation = (observationId: string) => {
  const {observations} = useObservationContext();
  return observations.get(observationId);
};
