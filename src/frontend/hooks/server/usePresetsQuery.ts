import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export function usePresetsQuery() {
  return useQuery({
    queryFn: async () => {
      return await api.preset.getMany();
    },
    queryKey: ['presets'],
  });
}
