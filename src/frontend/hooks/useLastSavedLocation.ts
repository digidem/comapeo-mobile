import {useQuery} from '@tanstack/react-query';
import {getLastKnownPositionAsync} from 'expo-location';

export const useLastSavedLocation = () => {
  return useQuery({
    queryKey: ['lastLocation'],
    queryFn: async () => getLastKnownPositionAsync(),
  });
};
