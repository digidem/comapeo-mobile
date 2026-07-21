import {getRandomBytes} from 'expo-crypto';
import {getItemAsync, setItemAsync} from 'expo-secure-store';
import nodejs from '@comapeo/nodejs-mobile-react-native';
import {uint8ArrayToHex} from 'uint8array-extras';
import {Paths} from 'expo-file-system';

const ROOT_KEY = '__RootKey';

async function getOrCreateRootKey(): Promise<string> {
  const existing = await getItemAsync(ROOT_KEY);
  if (existing) return existing;

  try {
    const newRootKey = uint8ArrayToHex(getRandomBytes(16));
    await setItemAsync(ROOT_KEY, newRootKey);
    return newRootKey;
  } catch (err) {
    throw new Error(
      `Error initializing root key: ${typeof err === 'string' ? err : ''}`,
    );
  }
}

interface InitializeOpts {
  metricsIsEnabled: boolean;
  sentryEnvironment: string;
  sentryUserId: string;
}

export async function initializeNodejs({
  metricsIsEnabled,
  sentryEnvironment,
  sentryUserId,
}: InitializeOpts) {
  const rootKey = await getOrCreateRootKey();

  const flags = [
    `--rootKey=${rootKey}`,
    `--sentryEnvironment=${sentryEnvironment}`,
    `--sentryUserId=${sentryUserId}`,
    `--availableDiskSpace=${Paths.availableDiskSpace}`,
  ];

  if (metricsIsEnabled) {
    flags.push('--metricsIsEnabled');
  }

  nodejs.startWithArgs(`loader.js ${flags.join(' ')}`);
}

/**
 * Used from the "not enough space" screen — either the user tapped Skip, or
 * they came back from Settings after freeing up space. We can't restart the
 * whole app here, so the backend just re-runs its startup on its own.
 */
export async function retryServerStart({
  forceSkipMigrate,
}: {
  forceSkipMigrate: boolean;
}) {
  const rootKey = await getOrCreateRootKey();

  nodejs.channel.post('server:restart', {
    rootKey,
    forceSkipMigrate,
    availableDiskSpace: Paths.availableDiskSpace,
  });
}
