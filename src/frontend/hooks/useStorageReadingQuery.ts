import DeviceInfo from 'react-native-device-info';
import {useSuspenseQuery} from '@tanstack/react-query';

export const STORAGE_QUERY_KEY = ['device', 'storage', 'reading'] as const;

async function getReading(): Promise<{freeBytes: number; totalBytes: number}> {
  const [freeBytes, totalBytes] = await Promise.all([
    DeviceInfo.getFreeDiskStorage(),
    DeviceInfo.getTotalDiskCapacity(),
  ]);
  return {freeBytes, totalBytes};
}

export function useStorageReadingQuery() {
  return useSuspenseQuery({
    queryKey: STORAGE_QUERY_KEY,
    queryFn: getReading,
  });
}
