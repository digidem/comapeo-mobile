import {getRandomBytes} from 'expo-crypto';
import {MMKV} from 'react-native-mmkv';
import {uint8ArrayToHex} from 'uint8array-extras';

export function getMetricsDeviceId(storage: MMKV): string {
  const result = storage.getString('MetricsDeviceId');
  if (result) return result;

  const newId = uint8ArrayToHex(getRandomBytes(16));
  storage.set('MetricsDeviceId', newId);
  return newId;
}
