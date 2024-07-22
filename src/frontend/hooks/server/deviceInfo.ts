import {type DeviceInfo} from '@mapeo/schema';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deviceType, DeviceType} from 'expo-device';

import {useApi} from '../../contexts/ApiContext';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

export const DEVICE_INFO_KEY = 'deviceInfo';
export const CREATED_BY_TO_DEVICE_ID_KEY = 'createdByToDeviceId';

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
        deviceType: deviceType ? expoToCoreDeviceType(deviceType) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [DEVICE_INFO_KEY]});
    },
  });
};

export const useCreatedByToDeviceId = (createdBy: string) => {
  const project = useActiveProject();

  return useQuery({
    queryKey: [CREATED_BY_TO_DEVICE_ID_KEY, createdBy],
    queryFn: async () => {
      return await project.$createdByToDeviceId(createdBy);
    },
  });
};

function expoToCoreDeviceType(d: DeviceType): DeviceInfo['deviceType'] {
  switch (d) {
    case DeviceType.PHONE: {
      return 'mobile';
    }
    case DeviceType.TABLET: {
      return 'tablet';
    }
    case DeviceType.TV: {
      return undefined;
    }
    case DeviceType.DESKTOP: {
      return 'desktop';
    }
    case DeviceType.UNKNOWN: {
      return 'UNRECOGNIZED';
    }
    default: {
      throw new Error(`Invalid device type ${d}`);
    }
  }
}
