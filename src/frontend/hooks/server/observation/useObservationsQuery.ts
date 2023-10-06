import {useQuery} from '@tanstack/react-query';
import {api} from '../../../api';

export const useObservationsQuery = () => {
  return useQuery(
    ['observations'],
    async () => await api.observation.getMany(),
  );
};
