import {useMutation} from '@tanstack/react-query';
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
  return convertMediaSyncSetting(isArchive);
}

export function useSetMediaSyncSetting() {
  const setIsArchive = useSetIsArchiveDevice();

  const {mutate, status, reset} = useMutation({
    mutationKey: [UPDATE_MEDIA_SETTING],
    mutationFn: (newSetting: MediaSyncSetting) => {
      return new Promise((res, rej) => {
        setIsArchive.mutate(
          {isArchiveDevice: isArchiveDevice(newSetting)},
          {
            onError: rej,
            onSuccess: res,
          },
        );
      });
    },
  });

  return {mutate, status, reset};
}
