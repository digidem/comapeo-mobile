import 'react-native-gesture-handler/jestSetup';
import {setUpTests} from 'react-native-reanimated';
import {jest} from '@jest/globals';

setUpTests();

// https://github.com/callstack/react-native-testing-library/issues/1712
jest.mock('expo-font', () => {
  /** @type {import('expo-font')} */
  const module = {
    ...jest.requireActual('expo-font'),
    isLoaded: jest.fn(() => true),
  };

  return module;
});
