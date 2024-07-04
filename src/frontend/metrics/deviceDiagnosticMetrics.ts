import {Dimensions, PixelRatio, Platform} from 'react-native';
import * as Device from 'expo-device';
import type {ReadonlyDeep} from 'type-fest';
import {getMonthlyHash} from './getMonthlyHash';

type DeviceDiagnosticMetricsData = {
  type: 'device diagnostics v1';
  monthlyDeviceHash: string;
  brand?: string;
  deviceType?: string;
  isEmulator?: true;
  manufacturer?: string;
  model?: string;
  os: string;
  screen: {width: number; height: number; pixelRatio: number};
  supportedCpuArchitectures?: string[];
  totalMemory?: number;
};

function setIfNotNull<ObjT, KeyT extends keyof ObjT>(
  obj: ObjT,
  key: KeyT,
  value: null | ObjT[KeyT],
): void {
  if (value !== null) obj[key] = value;
}

function deviceTypeToString(deviceType: null | Device.DeviceType): string {
  switch (deviceType) {
    case Device.DeviceType.PHONE:
      return 'PHONE';
    case Device.DeviceType.TABLET:
      return 'TABLET';
    case Device.DeviceType.DESKTOP:
      return 'DESKTOP';
    case Device.DeviceType.TV:
      return 'TV';
    case null:
    case Device.DeviceType.UNKNOWN:
    default:
      return 'UNKNOWN';
  }
}

export async function generateDeviceDiagnosticMetricsData({
  metricsDeviceId,
}: ReadonlyDeep<{
  metricsDeviceId: string;
}>): Promise<DeviceDiagnosticMetricsData> {
  const screen = Dimensions.get('screen');

  const result: DeviceDiagnosticMetricsData = {
    type: 'device diagnostics v1',
    os: Platform.OS,
    screen: {
      width: screen.width,
      height: screen.height,
      pixelRatio: PixelRatio.get(),
    },
    monthlyDeviceHash: await getMonthlyHash(
      'device diagnostics',
      metricsDeviceId,
      new Date(),
    ),
  };

  setIfNotNull(result, 'brand', Device.brand);
  setIfNotNull(result, 'deviceType', deviceTypeToString(Device.deviceType));
  setIfNotNull(result, 'manufacturer', Device.manufacturer);
  setIfNotNull(result, 'model', Device.modelId || Device.modelName);
  setIfNotNull(
    result,
    'supportedCpuArchitectures',
    Device.supportedCpuArchitectures,
  );
  setIfNotNull(result, 'totalMemory', Device.totalMemory);

  const isEmulator = !Device.isDevice;
  if (isEmulator) result.isEmulator = true;

  return result;
}
