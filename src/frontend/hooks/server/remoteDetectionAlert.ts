import {useSuspenseQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const REMOTE_DETECTION_ALERTS_KEY = 'alerts';

export function useRemoteDectionAlerts() {
  const {projectId, projectApi} = useActiveProject();

  return useSuspenseQuery({
    queryFn: async () => {
      return await projectApi.remoteDetectionAlert.getMany();
    },
    queryKey: [REMOTE_DETECTION_ALERTS_KEY, projectId],
  });
}
