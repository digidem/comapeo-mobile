import {useObservationContext} from '../contexts/ObservationsContext';

export const useObservationWithPreset = (observationId: string) => {
  const {observations, presets} = useObservationContext();
  const observation = observations.get(observationId);
  const preset =
    observation && typeof observation.tags['categoryId'] === 'string'
      ? presets.find(pres => pres.docId === observation.tags['categoryId'])
      : undefined;

  if (!observation) {
    throw new Error('Observation does not exist');
  }

  if (!preset) {
    throw new Error('Preset does not exist');
  }

  return {observation, preset};
};
