import type {MapeoProject} from '@mapeo/core/dist/mapeo-project';
import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {useProject} from './projects';
import {ClientGeneratedObservation} from '../../sharedTypes';

export const OBSERVATION_KEY = 'observations';

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
    queryKey: [OBSERVATION_KEY, observationId],
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
    mutationFn: async ({value}: {value: ClientGeneratedObservation}) => {
      if (!project) throw new Error('Project instance does not exist');

      return project.observation.create({
        ...value,
        schemaName: 'observation',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY]});
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
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY]});
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
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY]});
    },
  });
}
