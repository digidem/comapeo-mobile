import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {PresetValue} from '@comapeo/schema';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {usePersistedLocale} from '../persistedState/usePersistedLocale';

export const PRESETS_KEY = 'presets';

export function usePresetsQuery() {
  const {projectId, projectApi} = useActiveProject();
  const locale = usePersistedLocale(store => store.locale);

  return useSuspenseQuery({
    queryKey: [PRESETS_KEY, projectId, locale],
    queryFn: async () => {
      return await projectApi.preset.getMany({lang: locale});
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
