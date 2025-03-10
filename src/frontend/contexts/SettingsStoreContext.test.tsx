import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {DEFAULT_OBSCURE_CODE} from '../lib/security';
import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsActions,
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
    obscureCode: null,
    passcode: null,
  });
});

describe('security', () => {
  test('passcode cannot be set to invalid value', () => {
    const store = createSettingsStore();
    const wrapper = createWrapper(store);

    const actionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    expect(() => {
      actionsHook.result.current.setPasscode('abc');
    }).toThrow();
  });

  test('obscure code cannot be set when passcode is not set', () => {
    const store = createSettingsStore();
    const wrapper = createWrapper(store);

    const actionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    expect(() => {
      actionsHook.result.current.enableObscureCode(true);
    }).toThrow('Cannot enable obscure code if passcode is not set');
  });

  test('obscure code has expected value when enabled', () => {
    const store = createSettingsStore();
    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useSettingsState(), {
      wrapper,
    });

    const actionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setPasscode('12345');
    });

    expect(stateHook.result.current).toStrictEqual({
      coordinateFormat: null,
      locale: null,
      manualCoordinateEntryFormat: null,
      metricsDiagnosticsPermissionsEnabled: null,
      obscureCode: null,
      passcode: '12345',
    });

    act(() => {
      actionsHook.result.current.enableObscureCode(true);
    });

    expect(stateHook.result.current).toStrictEqual({
      coordinateFormat: null,
      locale: null,
      manualCoordinateEntryFormat: null,
      metricsDiagnosticsPermissionsEnabled: null,
      obscureCode: DEFAULT_OBSCURE_CODE,
      passcode: '12345',
    });

    expect(stateHook.result.current.passcode).not.toBe(
      stateHook.result.current.obscureCode,
    );
  });

  test('obscure code is unset when passcode is unset', () => {
    const store = createSettingsStore();
    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useSettingsState(), {
      wrapper,
    });

    const actionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      actionsHook.result.current.setPasscode('12345');
      actionsHook.result.current.enableObscureCode(true);
    });

    expect(stateHook.result.current).toStrictEqual({
      coordinateFormat: null,
      locale: null,
      manualCoordinateEntryFormat: null,
      metricsDiagnosticsPermissionsEnabled: null,
      obscureCode: DEFAULT_OBSCURE_CODE,
      passcode: '12345',
    });

    act(() => {
      actionsHook.result.current.setPasscode(null);
    });

    expect(stateHook.result.current).toStrictEqual({
      coordinateFormat: null,
      locale: null,
      manualCoordinateEntryFormat: null,
      metricsDiagnosticsPermissionsEnabled: null,
      obscureCode: null,
      passcode: null,
    });
  });
});
