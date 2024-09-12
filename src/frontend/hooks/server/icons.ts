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
    // already defaults to 3 if not specified
    // but being explicit about needing a non-zero retry value
    // due to https://github.com/digidem/comapeo-core/issues/821#issuecomment-2344231495
    retry: 3,
  });
}
