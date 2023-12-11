import type {MapeoProject} from '@mapeo/core/dist/mapeo-project';
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {useProject} from './projects';

export function useObservations() {
  const project = useProject();

  return useSuspenseQuery({
    queryKey: ['observations'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.getMany();
    },
  });
}

export function useObservation(observationId: string) {
  const project = useProject();

  return useSuspenseQuery({
    queryKey: ['observations', observationId],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.getByDocId(observationId);
    },
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  const project = useProject();

  return useMutation({
    mutationFn: async ({
      value,
    }: {
      value: Parameters<MapeoProject['observation']['create']>[0];
    }) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.create(value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['observations']});
    },
  });
}

export function useEditObservation() {
  const queryClient = useQueryClient();
  const project = useProject();

  return useMutation({
    mutationFn: async ({
      id,
      value,
    }: {
      id: Parameters<MapeoProject['observation']['update']>[0];
      value: Parameters<MapeoProject['observation']['update']>[1];
    }) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.update(id, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['observations']});
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  const project = useProject();

  return useMutation({
    mutationFn: async ({id}: {id: string}) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['observations']});
    },
  });
}
