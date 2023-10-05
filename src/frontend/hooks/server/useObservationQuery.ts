import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export const useObservationQuery = (id: string) => {
  return useQuery({
    queryFn: async () => await api.observation.getByDocId(id),
    queryKey: ['observation', id],
  });
};
