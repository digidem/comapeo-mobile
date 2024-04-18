import {useQueryClient, useMutation} from '@tanstack/react-query';
import {useProject} from './projects';
import {TrackValue} from '@mapeo/schema';

export const TRACK_KEY = 'track';

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: async (params: TrackValue) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.track.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
