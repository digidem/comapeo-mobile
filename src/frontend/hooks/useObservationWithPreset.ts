import {useObservation} from './server/observations';
import {usePresetsQuery} from './server/presets';

export const useObservationWithPreset = (observationId: string) => {
  const {data: observation} = useObservation(observationId);
  const {data: presets} = usePresetsQuery();
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
