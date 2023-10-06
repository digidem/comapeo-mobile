import {useMutation, useQueryClient} from '@tanstack/react-query';

export const useDeleteObservation = (observationId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await mockDelete(observationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        'observation',
        observationId,
        'observations',
      ]);
    },
  });

  return mutation;
};

async function mockDelete(observationId: string) {
  return {};
}
