import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useManyDocs} from '@comapeo/core-react';

export const OBSERVATION_KEY = 'observations';

export function useObservations() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'observation',
  });
}
