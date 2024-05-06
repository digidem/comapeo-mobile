import {
  useQueryClient,
  useMutation,
  useSuspenseQuery,
  useQuery,
} from '@tanstack/react-query';
import {useProject} from './projects';
import {TrackValue} from '@mapeo/schema';

export const TRACK_KEY = 'tracks';

export function useCreateTrack() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: async (params: TrackValue) => {
      return project.track.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}

export function useUpdateTrack(versionId?: string) {
  const project = useProject();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: TrackValue) => {
      return project.track.update(versionId!, params);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_KEY, data.docId],
      });
    },
  });
}

export function useTracksQuery() {
  const project = useProject();
  return useSuspenseQuery({
    queryKey: [TRACK_KEY],
    queryFn: async () => {
      return project.track.getMany();
    },
  });
}

export function useTrackWithEnableOptionQuery(docId?: string) {
  const project = useProject();
  return useQuery({
    queryKey: [TRACK_KEY, docId],
    enabled: !!docId,
    queryFn: async () => {
      if (!docId) return;
      return project.track.getByDocId(docId);
    },
  });
}

export function useTrackQuery(docId: string) {
  const project = useProject();
  return useSuspenseQuery({
    queryKey: [TRACK_KEY, docId],
    queryFn: async () => {
      return project.track.getByDocId(docId);
    },
  });
}

export function useDeleteTrackMutation() {
  const queryClient = useQueryClient();
  const project = useProject();
  return useMutation({
    mutationFn: async (docId: string) => {
      return project.track.delete(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
