import {getRandomBytes} from 'expo-crypto';
import {uint8ArrayToHex} from 'uint8array-extras';
import {createPersistedState} from './createPersistedState';

const useSlice = createPersistedState(
  () => ({metricsDeviceId: uint8ArrayToHex(getRandomBytes(16))}),
  'MetricsDeviceId',
);

export const usePersistedMetricsDeviceId = (): string =>
  useSlice(store => store.metricsDeviceId);
