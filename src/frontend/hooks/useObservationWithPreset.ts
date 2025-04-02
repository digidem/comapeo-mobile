import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useSingleDocByDocId} from '@comapeo/core-react';
import {usePresetsQuery} from './server/presets';
import {matchPreset} from '../lib/utils';

export function useObservationWithPreset(observationId: string) {
  const {projectId} = useActiveProject();
  const {data: observation} = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationId,
  });

  const {data: presets} = usePresetsQuery();

  const preset = matchPreset(observation.tags, presets);

  return {observation, preset};
}
