import {
  useMutation,
  useMutationState,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';

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
    mutationKey: ['deviceInfo'],
    mutationFn: async (name: string) => {
      return mapeoApi.setDeviceInfo({name});
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({queryKey: ['deviceInfo']});
    },
  });
};
