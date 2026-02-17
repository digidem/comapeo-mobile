import {jest, afterAll} from '@jest/globals';
import 'react-native-gesture-handler/jestSetup';
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import {randomBytes} from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as url from 'node:url';
import {NativeModules} from 'react-native';
import {setUpTests} from 'react-native-reanimated';

setUpTests();

// Module resolution error when using expo/winter. See: https://github.com/expo/expo/issues/36831#issuecomment-3107047371
jest.mock('expo/src/winter/ImportMetaRegistry', () => ({
  ImportMetaRegistry: {
    get url() {
      return null;
    },
  },
}));

jest.mock('react-native-nitro-modules', () => {});

jest.mock('@react-native-community/netinfo', () => mockNetInfo);

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

// https://github.com/callstack/react-native-testing-library/issues/1712
jest.mock('expo-font', () => {
  /** @type {import('expo-font')} */
  const module = {
    ...jest.requireActual('expo-font'),
    isLoaded: jest.fn(() => true),
  };

  return module;
});

// Native modules won't work in tests.
NativeModules.FlagSecureModule = {
  activate: () => {},
  deactivate: () => {},
};

function temporaryDirectory() {
  const result = path.join(
    os.tmpdir(),
    'comapeo-mobile-tests-' + randomBytes(16).toString('hex'),
  );
  fs.mkdirSync(result);
  afterAll(async () => {
    await fs.promises.rm(result, {force: true, recursive: true, maxRetries: 3});
  });
  return result;
}

// `expo-file-system` is already mocked, but we need to extend it.
const FileSystem = jest.requireMock('expo-file-system');
FileSystem.documentDirectory = url
  .pathToFileURL(temporaryDirectory())
  .toString();
