import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export function usePresets() {
  return useQuery({
    queryFn: async () => {
      return await api.preset.getMany();
    },
    queryKey: ['presets'],
  });
}
