import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';

import {useProject} from './projects';
import {PresetValue} from '@mapeo/schema';

export function usePresetsQuery() {
  const project = useProject();

  return useSuspenseQuery({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!project) throw new Error('Project instance does not exist');
      return await project.preset.getMany();
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

export function useGetPresetIcon(iconId?: string) {
  const project = useProject();

  return useQuery({
    queryKey: ['PresetIcon', iconId],
    enabled: !!iconId,
    queryFn: async () => {
      return await project.$icons.getIconUrl(iconId!, {
        mimeType: 'image/png',
        size: 'small',
        pixelDensity: 3,
      });
    },
  });
}
