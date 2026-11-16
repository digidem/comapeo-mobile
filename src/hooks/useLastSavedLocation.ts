import {useQuery} from '@tanstack/react-query';
import {getLastKnownPositionAsync} from 'expo-location';

export const useLastKnownLocation = () => {
  return useQuery({
    queryKey: ['lastLocation'],
    queryFn: async () => getLastKnownPositionAsync(),
  });
};

/**
 * This query prefetchs the last saved location but will NOT cause any re-renders (aka should only be use to preopulate the cache) Followed this guide: https://tanstack.com/query/latest/docs/react/guides/prefetching
 */
export const usePrefetchLastKnownLocation = () => {
  useQuery({
    queryKey: ['lastLocation'],
    queryFn: async () => getLastKnownPositionAsync(),
    // Optional optimization to avoid rerenders when this query changes:
    notifyOnChangeProps: [],
  });
};
