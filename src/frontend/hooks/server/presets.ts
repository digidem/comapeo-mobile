import {useQuery} from '@tanstack/react-query';

import {useProject} from './projects';

export function usePresetsQuery() {
  const {data: project} = useProject();

  return useQuery({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.preset.getMany();
    },
    enabled: !!project,
  });
}
