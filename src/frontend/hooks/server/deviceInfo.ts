import {useQuery} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

export const useDeviceName = () => {
  const mapeoApi = useApi();

  return useQuery({
    queryKey: ['deviceName'],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });
};
