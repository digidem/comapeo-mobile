import {useQuery} from '@tanstack/react-query';
import {getLastKnownPositionAsync} from 'expo-location';

export const useLastSavedLocation = () => {
  return useQuery({
    queryKey: ['lastPostition'],
    queryFn: async () =>
      getLastKnownPositionAsync().catch(err => console.log(err)),
  });
};
