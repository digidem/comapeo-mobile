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
  const {projectId, projectApi} = useActiveProject();

  return useSuspenseQuery({
    queryKey: [PRESETS_KEY, projectId],
    queryFn: async () => {
      return await projectApi.preset.getMany();
    },
  });
}

export function usePresetsMutation() {
  const {projectApi} = useActiveProject();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preset: PresetValue) => {
      return await projectApi.preset.create(preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [PRESETS_KEY]});
    },
  });
}

export function useGetPresetIcon(size: IconSize, name?: string) {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: ['presetIcon', projectId, size, name],
    enabled: !!name,
    queryFn: async () => {
      const currentPreset = await projectApi.preset
        .getMany()
        .then(res => res.find(p => p.name === name));

      return await projectApi.$icons.getIconUrl(currentPreset?.iconId!, {
        mimeType: 'image/png',
        size: size,
        pixelDensity: 3,
      });
    },
  });
}
