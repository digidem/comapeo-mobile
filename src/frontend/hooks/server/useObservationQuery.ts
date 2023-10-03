import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export const useObservationQuery = (id: string) => {
  return useQuery(['observation', id], () => {
    return api.observation.getByDocId(id);
  });
};
