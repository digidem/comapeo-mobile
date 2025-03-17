import {renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsState,
} from './SettingsStoreContext';

function createWrapper(settingsStore: SettingsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SettingsStoreProvider value={settingsStore}>
        {children}
      </SettingsStoreProvider>
    );
  };
}

test('initial state', () => {
  const store = createSettingsStore();
  const wrapper = createWrapper(store);

  const stateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual({
    coordinateFormat: null,
    locale: null,
    manualCoordinateEntryFormat: null,
    metricsDiagnosticsPermissionsEnabled: null,
  });
});
