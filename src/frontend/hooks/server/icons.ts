import type {IconApi} from '@comapeo/core';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useIconUrl} from '@comapeo/core-react';

export const ICONS_KEY = 'icons';

export function useProjectIconUrl(iconId: string, type: 'svg' | 'png' = 'svg') {
  const {projectId} = useActiveProject();

  const iconOpts: IconApi.BitmapOpts | IconApi.SvgOpts =
    type === 'svg'
      ? {mimeType: 'image/svg+xml', size: 'medium'}
      : {mimeType: 'image/png', size: 'medium', pixelDensity: 3};

  return useIconUrl({
    projectId,
    iconId,
    ...iconOpts,
  });
}
