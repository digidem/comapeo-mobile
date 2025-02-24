import {useQuery} from '@tanstack/react-query';
import DeviceInfo from 'react-native-device-info';

const DEVICE_INFO_KEY = 'deviceInfo';

// Ensure the methodName is a key of DeviceInfoMethods
export type MethodName = keyof typeof DeviceInfo;

export function useDeviceInfo<M extends MethodName>(
  methodName: M,
  ...params: Parameters<(typeof DeviceInfo)[M]>
) {
  return useQuery({
    queryFn: async () => {
      const method = DeviceInfo[methodName] as (
        ...args: unknown[]
      ) => Promise<unknown>;
      if (typeof method === 'function') {
        if (params.length > 0) {
          return await method(...params);
        } else {
          return await method();
        }
      } else {
        throw new Error(`Method ${methodName} is not a function on DeviceInfo`);
      }
    },
    queryKey: [DEVICE_INFO_KEY, methodName],
  });
}
