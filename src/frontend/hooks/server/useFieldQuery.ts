import {useQueries} from '@tanstack/react-query';

const useFieldsQuery = (fieldIds: string[]) => {
  return useQueries({
    queries: fieldIds.map(fieldId => ({
      queryKey: ['field', fieldId],
      queryFn: async () => await mockFieldQueryApi(fieldId),
    })),
  });
};

async function mockFieldQueryApi(fieldId: string) {
  return {};
}
