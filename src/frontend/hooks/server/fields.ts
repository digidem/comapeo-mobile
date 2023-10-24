import {useQuery} from '@tanstack/react-query';

import {useProject} from './projects';

export const useFieldsQuery = () => {
  const {data: project} = useProject();

  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.field.getMany();
    },
    enabled: !!project,
  });
};
