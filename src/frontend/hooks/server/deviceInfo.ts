import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {useProject} from './projects';

export const useDeviceInfo = () => {
  const mapeoApi = useApi();

  return useQuery({
    queryKey: ['deviceInfo'],
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
      queryClient.invalidateQueries({queryKey: ['deviceInfo']});
    },
  });
};
