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

export function useGetPresetIcon(docId: string | undefined, size: IconSize) {
  const {projectId, projectApi} = useActiveProject();

  return useQuery<string, Error>({
    queryKey: ['presetIconFromDocId', projectId, docId, size],
    enabled: !!docId,
    queryFn: async () => {
      if (!docId) {
        throw new Error('Preset icon reference not found');
      }
      return await projectApi.$icons.getIconUrl(docId, {
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
