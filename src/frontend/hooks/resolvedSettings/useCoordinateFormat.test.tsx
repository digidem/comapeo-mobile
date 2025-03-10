import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsActions,
} from '../../contexts/SettingsStoreContext';
import {useCoordinateFormat} from './useCoordinateFormat';

function createWrapper(settingsStore: SettingsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SettingsStoreProvider value={settingsStore}>
        {children}
      </SettingsStoreProvider>
    );
  };
}

test('has expected value based on settings state', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const settingsActionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const coordinateFormatHook = renderHook(() => useCoordinateFormat(), {
    wrapper,
  });

  // Initial state
  expect(coordinateFormatHook.result.current).toBe('utm');

  act(() => {
    settingsActionsHook.result.current.setCoordinateFormat('dd');
  });

  expect(coordinateFormatHook.result.current).toBe('dd');

  act(() => {
    settingsActionsHook.result.current.setCoordinateFormat('dms');
  });

  expect(coordinateFormatHook.result.current).toBe('dms');

  act(() => {
    settingsActionsHook.result.current.setCoordinateFormat('utm');
  });

  expect(coordinateFormatHook.result.current).toBe('utm');
});
