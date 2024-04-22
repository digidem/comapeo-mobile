import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
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

export function useTracksQuery() {
  const project = useProject();
  return useSuspenseQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.track.getMany();
    },
  });
}

export function useTrackQuery(docId: string) {
  const project = useProject();
  return useSuspenseQuery({
    queryKey: ['tracks', docId],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.track.getByDocId(docId);
    },
  });
}

export function useDeleteTrackMutation() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.track.delete(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
