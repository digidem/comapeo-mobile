import 'react-native-gesture-handler/jestSetup';
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import {NativeModules} from 'react-native';
import {setUpTests} from 'react-native-reanimated';
import {jest} from '@jest/globals';

setUpTests();

const mockExpoLocation = {
  Accuracy: {
    Lowest: 1,
    Low: 2,
    Balanced: 3,
    High: 4,
    Highest: 5,
    BestForNavigation: 6,
  },
  getForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({
      status: 'granted',
      expires: 'never',
      granted: true,
      canAskAgain: true,
    }),
  ),
  getLastKnownPositionAsync: jest.fn(() => Promise.resolve(null)),
  watchPositionAsync: jest.fn(() => Promise.resolve({remove: jest.fn()})),
};
jest.mock('expo-location', () => mockExpoLocation);

jest.mock('@react-native-community/netinfo', () => mockNetInfo);

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

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
