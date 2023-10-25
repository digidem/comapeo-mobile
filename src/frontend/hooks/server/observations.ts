import type {MapeoProject} from '@mapeo/core/dist/mapeo-project';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

import {useProject} from './projects';
import {ClientGeneratedObservation} from '../../sharedTypes';

export function useObservations() {
  const {data: project} = useProject();
  console.log({project});
  return useQuery({
    queryKey: ['observations'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.getMany();
    },
    enabled: !!project,
  });
}

export function useObservation(observationId: string) {
  const {data: project} = useProject();

  return useQuery({
    queryKey: ['observations', observationId],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.getByDocId(observationId);
    },
    enabled: !!project,
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  const {data: project} = useProject();

  return useMutation({
    mutationFn: async ({value}: {value: ClientGeneratedObservation}) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.create({
        ...value,
        schemaName: 'observation',
        attachments: [],
      });
    },
    onSuccess: obs => {
      queryClient.invalidateQueries(['observation', obs.docId, 'observations']);
    },
  });
}

export function useEditObservation(id?: string) {
  if (!id) throw new Error('Cannot edit an observation that does not exist');
  const queryClient = useQueryClient();
  const {data: project} = useProject();

  return useMutation({
    mutationFn: async ({
      value,
    }: {
      value: Parameters<MapeoProject['observation']['update']>[1];
    }) => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.update(id, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['observation', id, 'observations']);
    },
  });
}

export function useDeleteObservation(id: string) {
  const queryClient = useQueryClient();
  const {data: project} = useProject();

  return useMutation({
    mutationFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['observation', id, 'observations']);
    },
  });
}
