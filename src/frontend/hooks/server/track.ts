import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {TrackValue} from '@mapeo/schema';

import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const TRACK_KEY = 'tracks';

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const project = useActiveProject();

  return useMutation({
    mutationFn: async (params: TrackValue) => {
      return project.track.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}

export function useTracks() {
  const project = useActiveProject();

  return useSuspenseQuery({
    queryKey: [TRACK_KEY],
    queryFn: async () => {
      return process.env.EXPO_PUBLIC_FEATURE_TRACKS
        ? project.track.getMany()
        : [];
    },
  });
}

export function useTrack(docId: string) {
  const project = useActiveProject();
  return useSuspenseQuery({
    queryKey: [TRACK_KEY, docId],
    queryFn: async () => {
      return project.track.getByDocId(docId);
    },
  });
}

export function useDeleteTrackMutation() {
  const queryClient = useQueryClient();
  const project = useActiveProject();

  return useMutation({
    mutationFn: async (docId: string) => {
      return project.track.delete(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
