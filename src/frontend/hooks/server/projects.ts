import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import nodejs from 'nodejs-mobile-react-native';

import {useApi} from '../../stores/apiStore';

function useActiveProjectId() {
  return useQuery({
    queryKey: ['activeProjectId'],
    queryFn: async () => {
      return new Promise<string>(res => {
        nodejs.channel.post('get-active-project-id');

        const subscription = nodejs.channel.addListener(
          'app:active-project-id',
          id => {
            // @ts-expect-error
            subscription.remove();
            res(id);
          },
        );
      });
    },
  });
}

export function useUpdateActiveProjectId() {
  const queryClient = useQueryClient();

  // TODO: Maybe optimistically update here?
  return useMutation({
    mutationFn: async (id: string) => {
      return nodejs.channel.post('update-active-project-id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['activeProjectId']);
    },
  });
}

export function useProject() {
  const api = useApi();
  const {data: projectId} = useActiveProjectId();

  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project id must be defined');
      return api.getProject(projectId);
    },
    enabled: !!projectId,
  });
}
