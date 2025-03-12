import {useMutation, useQueryClient} from '@tanstack/react-query';
import {ObservationValue} from '@comapeo/schema';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useManyDocs} from '@comapeo/core-react';

export const OBSERVATION_KEY = 'observations';

export function useObservations() {
  const {projectId} = useActiveProject();
  return useManyDocs({
    projectId,
    docType: 'observation',
  });
}

export function useEditObservation() {
  const queryClient = useQueryClient();
  const {projectId, projectApi} = useActiveProject();

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
      queryClient.invalidateQueries({
        queryKey: [OBSERVATION_KEY, projectId, data.docId],
      });
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
