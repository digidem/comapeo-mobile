import {matchPreset} from '../lib/utils';
import {useObservation} from './server/observations';
import {usePresetsQuery} from './server/presets';

export const useObservationWithPreset = (observationId: string) => {
  const {data: observation} = useObservation(observationId);
  const {data: presets} = usePresetsQuery();
  const preset = matchPreset(observation.tags, presets);

  return {observation, preset};
};
