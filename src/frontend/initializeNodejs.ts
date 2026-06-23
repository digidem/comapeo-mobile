import {getRandomBytes} from 'expo-crypto';
import {getItemAsync, setItemAsync} from 'expo-secure-store';
import nodejs from '@comapeo/nodejs-mobile-react-native';
import {uint8ArrayToHex} from 'uint8array-extras';
import {Paths} from 'expo-file-system';

const ROOT_KEY = '__RootKey';

interface InitializeOpts {
  metricsIsEnabled: boolean;
  sentryEnvironment: string;
  sentryUserId: string;
  forceSkipMigrate?: boolean;
}

export async function initializeNodejs({
  metricsIsEnabled,
  sentryEnvironment,
  sentryUserId,
  forceSkipMigrate,
}: InitializeOpts) {
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

  const flags = [
    `--rootKey=${rootKey}`,
    `--sentryEnvironment=${sentryEnvironment}`,
    `--sentryUserId=${sentryUserId}`,
    `--availableDiskSpace=${Paths.availableDiskSpace}`,
  ];

  if (metricsIsEnabled) {
    flags.push('--metricsIsEnabled');
  }

  if (forceSkipMigrate) {
    flags.push('--forceSkipMigrate');
  }

  nodejs.startWithArgs(`loader.js ${flags.join(' ')}`);
}
