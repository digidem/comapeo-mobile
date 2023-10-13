import {useQuery} from '@tanstack/react-query';
import {useProjectContext} from '../../contexts/ProjectContext';

export function usePresetsQuery() {
  const project = useProjectContext();
  return useQuery({
    queryFn: async () => {
      return await project.preset.getMany();
    },
    queryKey: ['presets'],
  });
}
