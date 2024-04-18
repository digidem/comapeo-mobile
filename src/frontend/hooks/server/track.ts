import {MapeoProject} from '@mapeo/core/dist/mapeo-project';
import {useQueryClient, useMutation} from '@tanstack/react-query';
import {useProject} from './projects';

export const TRACK_KEY = 'track';

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: async (
      params: Parameters<MapeoProject['track']['create']>[0],
    ) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.track.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
