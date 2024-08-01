import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const useFieldsQuery = () => {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: ['fields', projectId],
    queryFn: async () => {
      return projectApi.field.getMany();
    },
  });
};
