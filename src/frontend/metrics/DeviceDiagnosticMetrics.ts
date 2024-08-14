import * as Sentry from '@sentry/react-native';
import {AppState, Dimensions, PixelRatio, Platform} from 'react-native';
import * as NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device';
import {getMonthlyHash} from './getMonthlyHash';
import {sendMetricsData} from './sendMetricsData';
import {getMetricsRequestInfo} from './getMetricsRequestInfo';
import {storage} from '../hooks/persistedState/createPersistedState';
import {isDateValid, isSameUtcMonthAndYear} from '../lib/date';
import {setIfNotNull} from '../lib/setIfNotNull';
import {getMetricsDeviceId} from './getMetricsDeviceId';

const STORAGE_KEY = 'DeviceDiagnosticMetricsLastSentAt';

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

async function generateDeviceDiagnosticMetricsData(): Promise<DeviceDiagnosticMetricsData> {
  const screen = Dimensions.get('screen');

  const result: DeviceDiagnosticMetricsData = {
    type: 'device diagnostics v1',
    os: Platform.OS,
    screen: {
      width: screen.width,
      height: screen.height,
      pixelRatio: PixelRatio.get(),
    },
    deviceType: deviceTypeToString(Device.deviceType),
    monthlyDeviceHash: await getMonthlyHash(
      'device diagnostics',
      getMetricsDeviceId(),
      new Date(),
    ),
  };

  setIfNotNull(result, 'brand', Device.brand);
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

const hasEnoughTimeElapsed = (): boolean => {
  const lastSentAtMs = storage.getNumber(STORAGE_KEY) ?? -Infinity;
  const lastSentAtDate = new Date(lastSentAtMs);
  return (
    !isDateValid(lastSentAtDate) ||
    !isSameUtcMonthAndYear(lastSentAtDate, new Date())
  );
};

export class DeviceDiagnosticMetrics {
  #isEnabled = false;
  #isOnline = false;
  #isCurrentlySendingMetrics = false;

  #subscriptionCleanupFns: null | (() => void)[] = null;

  setEnabled(isEnabled: boolean): void {
    this.#isEnabled = isEnabled;

    if (isEnabled) {
      this.#addListenersIfNecessary();
    } else {
      this.#removeListeners();
    }

    this.#update();
  }

  #addListenersIfNecessary(): void {
    if (this.#subscriptionCleanupFns) return;

    const subscriptionCleanupFns: (() => void)[] = [];

    subscriptionCleanupFns.push(
      NetInfo.addEventListener(state => {
        this.#isOnline = Boolean(state.isInternetReachable);
        this.#update();
      }),
    );

    const appStateSubscription = AppState.addEventListener('change', () => {
      this.#update();
    });
    subscriptionCleanupFns.push(() => appStateSubscription.remove());

    this.#subscriptionCleanupFns = subscriptionCleanupFns;
  }

  #removeListeners(): void {
    const subscriptionCleanupFns = this.#subscriptionCleanupFns ?? [];
    for (const fn of subscriptionCleanupFns) fn();
  }

  async #update(): Promise<void> {
    const shouldSendMetrics =
      this.#isEnabled &&
      this.#isOnline &&
      AppState.currentState === 'active' &&
      !this.#isCurrentlySendingMetrics &&
      hasEnoughTimeElapsed();
    if (!shouldSendMetrics) return;

    this.#isCurrentlySendingMetrics = true;

    try {
      await sendMetricsData({
        ...getMetricsRequestInfo(),
        dataToSend: await generateDeviceDiagnosticMetricsData(),
      });
      storage.set(STORAGE_KEY, Date.now());
    } catch (err) {
      Sentry.captureException(err);
    } finally {
      this.#isCurrentlySendingMetrics = false;
    }
  }
}
