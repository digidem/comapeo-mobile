import pProps from 'p-props';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type {ReadonlyDeep} from 'type-fest';
import {getMonthlyHash} from './getMonthlyHash';

type DeviceDiagnosticMetricsData = {
  type: 'device diagnostics v1';
  monthlyDeviceHash: string;
  os: string;
  screen: {width: number; height: number; pixelRatio: number};
  manufacturer?: string;
  brand?: string;
  model?: string;
  deviceType?: string;
  isEmulator?: true;
  supportedAbis: string[];
  totalMemory: number;
  installerPackageName: string;
};

export async function generateDeviceDiagnosticMetricsData({
  metricsDeviceId,
}: ReadonlyDeep<{
  metricsDeviceId: string;
}>): Promise<DeviceDiagnosticMetricsData> {
  const isEmulatorPromise = DeviceInfo.isEmulator();

  const screen = Dimensions.get('screen');
  const result: DeviceDiagnosticMetricsData = {
    type: 'device diagnostics v1',
    os: Platform.OS,
    screen: {
      width: screen.width,
      height: screen.height,
      pixelRatio: PixelRatio.get(),
    },
    ...(await pProps({
      monthlyDeviceHash: getMonthlyHash(
        'device diagnostics',
        metricsDeviceId,
        new Date(),
      ),
      supportedAbis: DeviceInfo.supportedAbis(),
      totalMemory: DeviceInfo.getTotalMemory(),
      installerPackageName: DeviceInfo.getInstallerPackageName(),
    })),
  };

  switch (Platform.OS) {
    case 'android':
      result.manufacturer = Platform.constants.Manufacturer;
      result.brand = Platform.constants.Brand;
      result.model = Platform.constants.Model;
      result.deviceType = Platform.constants.uiMode;
      break;
    case 'ios':
      result.model = DeviceInfo.getDeviceId();
      result.deviceType = Platform.constants.interfaceIdiom;
      break;
    default:
      break;
  }

  if (await isEmulatorPromise) result.isEmulator = true;

  return result;
}
