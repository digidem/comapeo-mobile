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
  const {projectId, projectApi} = useActiveProject();

  return useSuspenseQuery({
    queryKey: [OBSERVATION_KEY, projectId],
    queryFn: async () => {
      return projectApi.observation.getMany();
    },
  });
}

export function useObservation(observationId: string) {
  const {projectId, projectApi} = useActiveProject();

  return useSuspenseQuery({
    queryKey: [OBSERVATION_KEY, projectId, observationId],
    queryFn: async () => {
      return projectApi.observation.getByDocId(observationId);
    },
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async ({value}: {value: ClientGeneratedObservation}) => {
      return projectApi.observation.create({
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
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async ({
      versionId,
      value,
    }: {
      versionId: string;
      value: ObservationValue;
    }) => {
      return projectApi.observation.update(versionId, value);
    },
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY, data.docId]});
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  const {projectApi} = useActiveProject();

  return useMutation({
    mutationFn: async ({id}: {id: string}) => {
      return projectApi.observation.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [OBSERVATION_KEY]});
    },
  });
}
