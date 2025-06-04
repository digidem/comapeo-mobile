import 'react-native-gesture-handler/jestSetup';
import mockNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import {NativeModules} from 'react-native';
import {setUpTests} from 'react-native-reanimated';
import {jest} from '@jest/globals';

setUpTests();

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
