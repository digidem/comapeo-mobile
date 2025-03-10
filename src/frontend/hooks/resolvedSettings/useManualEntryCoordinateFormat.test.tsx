import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsActions,
} from '../../contexts/SettingsStoreContext';
import {useManualEntryCoordinateFormat} from './useManualEntryCoordinateFormat';

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

  const manualEntryCoordinateFormatHook = renderHook(
    () => useManualEntryCoordinateFormat(),
    {wrapper},
  );

  // Initial state
  expect(manualEntryCoordinateFormatHook.result.current).toBe('utm');

  act(() => {
    settingsActionsHook.result.current.setManualCoordinateEntryFormat('dd');
  });

  expect(manualEntryCoordinateFormatHook.result.current).toBe('dd');

  act(() => {
    settingsActionsHook.result.current.setManualCoordinateEntryFormat('dms');
  });

  expect(manualEntryCoordinateFormatHook.result.current).toBe('dms');

  act(() => {
    settingsActionsHook.result.current.setManualCoordinateEntryFormat('utm');
  });

  expect(manualEntryCoordinateFormatHook.result.current).toBe('utm');
});
