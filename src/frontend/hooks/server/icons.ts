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
  // Defaults to 3 if not specified but due to an edge case when pausing and resuming the app
  // (see https://github.com/digidem/comapeo-core/issues/821#issuecomment-2344231495),
  // we reduce the retry count for the benefit of more immediate UI feedback in that scenario
}
