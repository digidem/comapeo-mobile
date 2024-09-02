import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
  keepPreviousData,
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

export function useGetPresetIconFromPreset(
  preset: PresetValue,
  size: IconSize,
) {
  const {projectApi} = useActiveProject();

  return useQuery<string, Error>({
    queryKey: ['presetIconFromPreset', preset.iconRef?.docId, size],
    enabled: !!preset.iconRef?.docId,
    queryFn: async () => {
      if (!preset.iconRef?.docId) {
        throw new Error('Preset icon reference not found');
      }
      return await projectApi.$icons.getIconUrl(preset.iconRef.docId, {
        mimeType: 'image/png',
        size: size,
        pixelDensity: 3,
      });
    },
    retry: 2,
    retryDelay: 2000,
    staleTime: 60000,
    gcTime: 300000,
    placeholderData: keepPreviousData,
  });
}
