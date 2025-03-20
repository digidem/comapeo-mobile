import {useManyDocs} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const REMOTE_DETECTION_ALERTS_KEY = 'alerts';

export function useRemoteDetectionAlerts() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'remoteDetectionAlert',
  });
}
