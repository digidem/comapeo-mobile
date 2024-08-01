import {useQuery} from '@tanstack/react-query';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const useFieldsQuery = () => {
  const {project} = useActiveProject();

  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.field.getMany();
    },
  });
};
