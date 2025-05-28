import {useSuspenseQuery} from '@tanstack/react-query';
import {getLastKnownPositionAsync} from 'expo-location';

export const useLastKnownLocation = () => {
  return useSuspenseQuery({
    queryKey: ['lastLocation'],
    queryFn: async () => getLastKnownPositionAsync(),
  });
};
