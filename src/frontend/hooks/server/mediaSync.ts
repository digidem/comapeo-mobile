import {MediaSyncSetting} from '../../sharedTypes';
import {useIsArchiveDevice, useSetIsArchiveDevice} from '@comapeo/core-react';

export const UPDATE_MEDIA_SETTING = 'update_media_setting';

export function convertMediaSyncSetting(isArchive: boolean): MediaSyncSetting {
  return isArchive ? 'everything' : 'previews';
}

export function isArchiveDevice(value: MediaSyncSetting): boolean {
  return value === 'everything';
}

export function useGetMediaSyncSetting() {
  const {data: isArchive} = useIsArchiveDevice();
  const setting = convertMediaSyncSetting(isArchive);

  return {
    data: setting,
  };
}

export function useSetMediaSyncSetting() {
  const setIsArchive = useSetIsArchiveDevice();

  function mutate(newSetting: MediaSyncSetting) {
    setIsArchive.mutate({isArchiveDevice: isArchiveDevice(newSetting)});
  }

  return {
    mutate,
    status: setIsArchive.status,
    reset: setIsArchive.reset,
  };
}
