import {
  useMutation,
  useSuspenseQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {ObservationValue} from '@mapeo/schema';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {ClientGeneratedObservation} from '../../sharedTypes';

export const OBSERVATION_KEY = 'observations';

export function useObservations() {
  const project = useActiveProject();

  return useSuspenseQuery({
    queryKey: [OBSERVATION_KEY],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.observation.getMany();
    },
  });
}

export function useObservation(observationId: string) {
  const project = useActiveProject();

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
  const project = useActiveProject();

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
  const project = useActiveProject();

  return useMutation({
    mutationFn: async ({
      versionId,
      value,
    }: {
      versionId: string;
      value: ObservationValue;
    }) => {
      return project.observation.update(versionId, value);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY, data.docId]});
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  const project = useActiveProject();

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
