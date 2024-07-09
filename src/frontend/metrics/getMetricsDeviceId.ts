import {getRandomBytes} from 'expo-crypto';
import {uint8ArrayToHex} from 'uint8array-extras';
import {storage} from '../hooks/persistedState/createPersistedState';

export function getMetricsDeviceId(): string {
  const result = storage.getString('MetricsDeviceId');
  if (result) return result;

  const newId = uint8ArrayToHex(getRandomBytes(16));
  storage.set('MetricsDeviceId', newId);
  return newId;
}
