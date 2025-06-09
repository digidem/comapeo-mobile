import {MediaSyncSetting} from '../../sharedTypes';
import {useIsArchiveDevice} from '@comapeo/core-react';

export const UPDATE_MEDIA_SETTING = 'update_media_setting';

export function convertMediaSyncSetting(isArchive: boolean): MediaSyncSetting {
  return isArchive ? 'everything' : 'previews';
}

export function isArchiveDevice(value: MediaSyncSetting): boolean {
  return value === 'everything';
}

export function useGetMediaSyncSetting() {
  const {data: isArchive} = useIsArchiveDevice();
  return convertMediaSyncSetting(isArchive);
}
