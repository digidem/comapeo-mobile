import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deviceType, DeviceType} from 'expo-device';

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
      return mapeoApi.setDeviceInfo({
        name,
        deviceType: expoToCoreDeviceType(deviceType),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [DEVICE_INFO_KEY]});
    },
  });
};

function expoToCoreDeviceType(
  d: Readonly<null | DeviceType>,
): 'mobile' | 'tablet' | 'desktop' | 'UNRECOGNIZED' {
  switch (d) {
    case DeviceType.PHONE: {
      return 'mobile';
    }
    case DeviceType.TABLET: {
      return 'tablet';
    }
    case DeviceType.DESKTOP: {
      return 'desktop';
    }
    case null:
    case DeviceType.TV:
    case DeviceType.UNKNOWN: {
      return 'UNRECOGNIZED';
    }
    default: {
      throw new Error(`Invalid device type ${d}`);
    }
  }
}
