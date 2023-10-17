import {Field} from '@mapeo/schema';
import {useQuery} from '@tanstack/react-query';
import {api} from '../../api';

export const useFieldsQuery = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => await api.field.getMany(),
  });
};
