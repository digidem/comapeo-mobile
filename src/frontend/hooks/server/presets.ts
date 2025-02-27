import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {PresetValue} from '@comapeo/schema';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useResolvedLanguageTag} from '../useResolvedLanguageTag';

export const PRESETS_KEY = 'presets';

export function usePresetsQuery() {
  const {projectId, projectApi} = useActiveProject();
  const lang = useResolvedLanguageTag().value;

  return useSuspenseQuery({
    queryKey: [PRESETS_KEY, projectId, lang],
    queryFn: async () => {
      return await projectApi.preset.getMany({lang});
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
