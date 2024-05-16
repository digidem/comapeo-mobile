import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';
import {PresetValue} from '@mapeo/schema';
import {IconSize} from '../../sharedTypes';

import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const PRESETS_KEY = 'presets';

export function usePresetsQuery() {
  const project = useActiveProject();

  return useSuspenseQuery({
    queryKey: [PRESETS_KEY],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return await project.preset.getMany();
    },
  });
}

export function usePresetsMutation() {
  const project = useActiveProject();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preset: PresetValue) => {
      if (!project) throw new Error('Project instance does not exist');
      return await project.preset.create(preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [PRESETS_KEY]});
    },
  });
}

export function useGetPresetIcon(size: IconSize, name?: string) {
  const project = useProject();

  return useQuery({
    queryKey: ['presetIcon', name],
    enabled: !!name,
    queryFn: async () => {
      const currentPreset = await project.preset
        .getMany()
        .then(res => res.find(p => p.name === name));

      return await project.$icons.getIconUrl(currentPreset?.iconId!, {
        mimeType: 'image/png',
        size: size,
        pixelDensity: 3,
      });
    },
  });
}
