import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';
import {useObservationQuery} from './useObservationQuery';

type usePresetQueryProps =
  | {
      observationId: string;
    }
  | {presetId: string};

export function usePresetQuery(id: string) {
  return useQuery({
    queryFn: async () => {
      return await api.preset.getByDocId(id);
    },
    queryKey: ['preset', id],
  });
}
