import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../api';

export const useDeleteObservation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.observation.delete(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey: ['observations']}),
  });
};
