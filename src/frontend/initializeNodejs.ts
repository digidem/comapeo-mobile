import {getRandomBytes} from 'expo-crypto';
import {getItemAsync, setItemAsync} from 'expo-secure-store';
import nodejs from 'nodejs-mobile-react-native';
import {uint8ArrayToHex} from 'uint8array-extras';

const ROOT_KEY = '__RootKey';

export async function initializeNodejs() {
  let rootKey = await getItemAsync(ROOT_KEY);
  if (!rootKey) {
    try {
      const newRootKey = uint8ArrayToHex(getRandomBytes(16));
      await setItemAsync(ROOT_KEY, newRootKey);
      rootKey = newRootKey;
    } catch (err) {
      throw new Error(
        `Error initializing root key: ${typeof err === 'string' ? err : ''}`,
      );
    }
  }

  nodejs.startWithArgs(`loader.js --rootKey ${rootKey}`);
}
