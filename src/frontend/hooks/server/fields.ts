import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const FIELDS_KEY = 'fields';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [FIELDS_KEY, projectId],
    queryFn: async () => {
      return projectApi.field.getMany();
    },
  });
};
