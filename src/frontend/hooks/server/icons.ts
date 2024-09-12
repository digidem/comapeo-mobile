import {useQuery} from '@tanstack/react-query';
import {IconSize} from '../../sharedTypes';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const ICONS_KEY = 'icons';

export function useIconUrl(iconId: string, size: IconSize) {
  const {projectId, projectApi} = useActiveProject();

  return useQuery({
    queryKey: [ICONS_KEY, projectId, iconId, size],
    queryFn: async () => {
      return projectApi.$icons.getIconUrl(iconId, {
        mimeType: 'image/png',
        size,
        pixelDensity: 3,
      });
    },
    // Defaults to 3 if not specified but due to an edge case when pausing and resuming the app
    // (see https://github.com/digidem/comapeo-core/issues/821#issuecomment-2344231495),
    // we reduce the retry count for the benefit of more immediate UI feedback in that scenario
    retry: 2,
  });
}
