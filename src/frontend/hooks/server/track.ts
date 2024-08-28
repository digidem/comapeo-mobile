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
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async (params: TrackValue) => {
      return projectApi.track.create(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}

export function useTracks() {
  const {projectId, projectApi} = useActiveProject();

  return useSuspenseQuery({
    queryKey: [TRACK_KEY, projectId],
    queryFn: async () => {
      return projectApi.track.getMany();
    },
  });
}

export function useTrackQuery(docId: string) {
  const {projectId, projectApi} = useActiveProject();
  return useSuspenseQuery({
    queryKey: [TRACK_KEY, projectId, docId],
    queryFn: async () => {
      return projectApi.track.getByDocId(docId);
    },
  });
}

export function useEditTrackMutation() {
  const queryClient = useQueryClient();
  const {projectId, projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async ({
      docId,
      updatedTrack,
    }: {
      docId: string;
      updatedTrack: TrackValue;
    }) => {
      return projectApi.track.update(docId, updatedTrack);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [TRACK_KEY, projectId, data.docId],
      });
    },
  });
}

export function useDeleteTrackMutation() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async (docId: string) => {
      return projectApi.track.delete(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [TRACK_KEY]});
    },
  });
}
