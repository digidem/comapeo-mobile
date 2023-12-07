import {useSuspenseQuery} from '@tanstack/react-query';

import {useProject} from './projects';

export function usePresetsQuery() {
  const project = useProject();

  return useSuspenseQuery({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return project.preset.getMany();
    },
  });
}
