import {getRandomBytes} from 'expo-crypto';
import {uint8ArrayToHex} from 'uint8array-extras';

type Storage = {
  getString(key: string): undefined | string;
  set(key: string, value: unknown): void;
};

export function getSentryUserId({
  now,
  storage,
}: {
  now: Date;
  storage: Storage;
}): string {
  const sentryId = storage.getString('sentryUser.id');
  const sentryIdMonth = storage.getString('sentryUser.idMonth');

  const currentUtcMonth = now.getUTCFullYear() + '-' + now.getUTCMonth();

  if (sentryId && sentryIdMonth === currentUtcMonth) {
    return sentryId;
  } else {
    const result = uint8ArrayToHex(getRandomBytes(16));
    storage.set('sentryUser.id', result);
    storage.set('sentryUser.idMonth', currentUtcMonth);
    return result;
  }
}
