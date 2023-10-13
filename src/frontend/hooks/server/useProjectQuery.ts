import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export function useProjectQuery(id: string | null) {
  return useQuery({
    queryFn: async () => await api.manager.getProject(id),
    queryKey: ['project', id],
  });
}
