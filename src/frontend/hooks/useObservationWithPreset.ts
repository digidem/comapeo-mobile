import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useSingleDocByDocId, useManyDocs} from '@comapeo/core-react';
import {matchPreset} from '../lib/utils';

export function useObservationWithPreset(observationId: string) {
  const {projectId} = useActiveProject();
  const {data: observation} = useSingleDocByDocId({
    projectId,
    docType: 'observation',
    docId: observationId,
  });

  const {data: presets} = useManyDocs({
    projectId,
    docType: 'preset',
  });

  const preset = matchPreset(observation.tags, presets);

  return {observation, preset};
}
