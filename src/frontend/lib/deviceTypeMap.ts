import {DeviceType} from 'expo-device';

export function expoToCoreDeviceType(
  expoType: DeviceType | null,
): 'mobile' | 'tablet' | 'desktop' | 'UNRECOGNIZED' {
  switch (expoType) {
    case DeviceType.PHONE:
      return 'mobile';
    case DeviceType.TABLET:
      return 'tablet';
    case DeviceType.DESKTOP:
      return 'desktop';
    default:
      return 'UNRECOGNIZED';
  }
}
