import {useClientApi} from '@comapeo/core-react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {MediaSyncSetting} from '../../sharedTypes';

export const MEDIA_SYNC_SETTING_KEY = 'media_sync_setting';

export function convertMediaSyncSetting(isArchive: boolean): MediaSyncSetting {
  return isArchive ? 'everything' : 'previews';
}

export function isArchiveDevice(value: MediaSyncSetting): boolean {
  return value === 'everything';
}

export function useGetMediaSyncSetting() {
  const api = useClientApi();

  return useSuspenseQuery({
    queryKey: [MEDIA_SYNC_SETTING_KEY],
    queryFn: async () => {
      const isArchive = await api.getIsArchiveDevice();
      return convertMediaSyncSetting(isArchive);
    },
  });
}

export function useSetMediaSyncSetting() {
  const api = useClientApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSetting: MediaSyncSetting) => {
      const isArchive = isArchiveDevice(newSetting);
      return api.setIsArchiveDevice(isArchive);
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: [MEDIA_SYNC_SETTING_KEY],
      });
    },
  });
}
