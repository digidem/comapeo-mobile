import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export const useObservations = () => {
  return useQuery(
    ['observations'],
    async () => await api.observation.getMany(),
  );
};
