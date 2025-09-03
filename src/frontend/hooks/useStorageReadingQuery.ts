import DeviceInfo from 'react-native-device-info';
import {useQuery, QueryClient} from '@tanstack/react-query';

export const LOW_THRESHOLD_BYTES = 500 * 1024 * 1024;
export const STORAGE_QUERY_KEY = ['device', 'storage', 'reading'] as const;

async function getReading() {
  try {
    const [freeBytes, totalBytes] = await Promise.all([
      DeviceInfo.getFreeDiskStorage(),
      DeviceInfo.getTotalDiskCapacity(),
    ]);
    return {freeBytes, totalBytes};
  } catch {
    return {
      freeBytes: null as number | null,
      totalBytes: null as number | null,
    };
  }
}

export function useStorageReadingQuery() {
  return useQuery({
    queryKey: STORAGE_QUERY_KEY,
    queryFn: getReading,
  });
}

export function isLowStorage(
  free: number | null,
  threshold: number = LOW_THRESHOLD_BYTES,
) {
  return (free ?? Infinity) <= threshold;
}

export function invalidateStorageReading(qc: QueryClient) {
  qc.invalidateQueries({queryKey: STORAGE_QUERY_KEY});
}
