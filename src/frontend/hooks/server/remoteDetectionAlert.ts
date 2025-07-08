import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export function useRemoteDetectionAlerts() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'remoteDetectionAlert',
  });
}
