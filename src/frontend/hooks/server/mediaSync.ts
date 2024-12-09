import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {MediaSyncSetting} from '../../sharedTypes';

export const MEDIA_SYNC_SETTING_KEY = 'media_sync_setting';

export function convertMediaSyncSetting(isArchive: boolean): MediaSyncSetting {
  return isArchive ? 'everything' : 'previews';
}

export function isArchiveDevice(value: MediaSyncSetting): boolean {
  return value === 'everything';
}

export function useGetMediaSyncSetting() {
  const api = useApi();

  return useQuery({
    queryKey: [MEDIA_SYNC_SETTING_KEY],
    queryFn: async () => {
      const isArchive = await api.getIsArchiveDevice();
      return convertMediaSyncSetting(isArchive);
    },
  });
}

export function useSetMediaSyncSetting() {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSetting: MediaSyncSetting) => {
      const isArchive = isArchiveDevice(newSetting);
      await api.setIsArchiveDevice(isArchive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [MEDIA_SYNC_SETTING_KEY]});
    },
  });
}
