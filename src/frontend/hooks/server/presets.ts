import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {useProject} from './projects';
import {PresetValue} from '@mapeo/schema';
import {MockPreset} from '../../mockdata';

export function usePresetsQuery() {
  const project = useProject();

  return useSuspenseQuery({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      const presets = await project.preset.getMany();
      // if (presets.length === 0) {
      //   await Promise.all([
      //     ...MockPreset.map(val => project.preset.create(val)),
      //   ]);
      //   return await project.preset.getMany();
      // }
      return presets;
    },
  });
}

export function usePresetsMutation() {
  const project = useProject();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preset: PresetValue) => {
      if (!project) throw new Error('Project instance does not exist');
      return await project.preset.create(preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['presets']});
    },
  });
}
