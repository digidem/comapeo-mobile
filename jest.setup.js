import {jest, afterAll} from '@jest/globals';
import {performance as nodePerformance} from 'node:perf_hooks';

// undici reads `performance.markResourceTiming` at import time (as early as
// @comapeo/core's own imports), so it must be patched before any test file loads.

globalThis.performance.markResourceTiming =
  nodePerformance.markResourceTiming.bind(nodePerformance);

jest.mock('./translations/index', () => {
  const actual = jest.requireActual('./translations/index');
  return {
    localeImports: Object.fromEntries(
      Object.keys(actual.localeImports).map(key => [
        key,
        () =>
          Promise.resolve({
            default: jest.requireActual('./translations/en.json'),
          }),
      ]),
    ),
  };
});
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

jest.mock('expo-audio', () => {
  const grantedPermission = {
    status: 'granted',
    expires: 'never',
    granted: true,
    canAskAgain: true,
  };
  const mockRecorder = {
    prepareToRecordAsync: jest.fn(() => Promise.resolve()),
    record: jest.fn(),
    stop: jest.fn(() => Promise.resolve()),
    uri: null,
  };
  return {
    getRecordingPermissionsAsync: jest.fn(() =>
      Promise.resolve(grantedPermission),
    ),
    requestRecordingPermissionsAsync: jest.fn(() =>
      Promise.resolve(grantedPermission),
    ),
    useAudioRecorder: jest.fn(() => mockRecorder),
    useAudioRecorderState: jest.fn(() => ({
      isRecording: false,
      durationMillis: 0,
    })),
    useAudioPlayer: jest.fn(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      seekTo: jest.fn(),
    })),
    useAudioPlayerStatus: jest.fn(() => ({
      isLoaded: false,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    })),
    RecordingPresets: {
      HIGH_QUALITY: {ios: {}, android: {}, web: {}},
      LOW_QUALITY: {ios: {}, android: {}, web: {}},
    },
  };
});

jest.mock('@lodev09/react-native-exify', () => ({
  read: jest.fn(() => Promise.resolve(null)),
}));

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

// MLRNModule crashes at load time when NativeModules.MLRNModule is absent.
jest.mock('@maplibre/maplibre-react-native', () => ({
  MapView: 'MapView',
  Camera: 'Camera',
  MarkerView: 'MarkerView',
  UserLocation: 'UserLocation',
  ShapeSource: 'ShapeSource',
  LineLayer: 'LineLayer',
  setAccessToken: jest.fn(),
  setTelemetryEnabled: jest.fn(),
  LineJoin: {Round: 'round', Bevel: 'bevel', Miter: 'miter'},
  LineCap: {Round: 'round', Butt: 'butt', Square: 'square'},
}));

// `ComapeoCoreModule.ts` calls `requireNativeModule("ComapeoCore")` at
// import time, which throws in tests since there's no native module and
// no `mocks/ComapeoCore.js` for jest-expo to pick up.
jest.mock('@comapeo/core-react-native/sentry', () => ({
  sentryConfig: {},
  getDiagnosticsEnabled: jest.fn(() => false),
  setDiagnosticsEnabled: jest.fn(() => Promise.resolve()),
  getApplicationUsageData: jest.fn(() => false),
  setApplicationUsageData: jest.fn(() => Promise.resolve()),
  getDebugEnabled: jest.fn(() => false),
  setDebugEnabled: jest.fn(() => Promise.resolve()),
  getRootUserId: jest.fn(() => 'TEST-TEST-TEST'),
  initSentry: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => undefined),
  useCameraPermission: jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(() => Promise.resolve(true)),
  })),
}));

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
