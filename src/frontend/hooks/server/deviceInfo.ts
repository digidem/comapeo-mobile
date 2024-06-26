import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

export const DEVICE_INFO_KEY = 'deviceInfo';

export const useDeviceInfo = () => {
  const mapeoApi = useApi();

  return useQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });
};

export const useEditDeviceInfo = () => {
  const mapeoApi = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['device'],
    mutationFn: async (name: string) => {
      return mapeoApi.setDeviceInfo({name});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [DEVICE_INFO_KEY]});
    },
  });
};
