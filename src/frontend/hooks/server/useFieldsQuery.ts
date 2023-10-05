import {Field} from '@mapeo/schema';
import {useQuery} from '@tanstack/react-query';

export const useFieldsQuery = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => await mockFieldsQueryApi(),
  });
};

async function mockFieldsQueryApi(): Promise<Field[]> {
  return [];
}
