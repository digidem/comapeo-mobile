import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useIconUrl} from '@comapeo/core-react';
import {IconSize} from '../../sharedTypes';

export const ICONS_KEY = 'icons';

export function useProjectIconUrl(iconId: string, size: IconSize) {
  const {projectId} = useActiveProject();

  return useIconUrl({
    projectId,
    iconId,
    mimeType: 'image/png',
    pixelDensity: 3,
    size,
  });
}
