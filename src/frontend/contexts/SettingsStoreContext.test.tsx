import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

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

test('initial settings state', () => {
  const store = createSettingsStore();
  const wrapper = createWrapper(store);

  const stateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual({
    coordinateFormat: 'utm',
    locale: null,
    manualCoordinateEntryFormat: 'utm',
    metricsDiagnosticsPermissionsEnabled: true,
  });
});

test('coordinate format', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const actionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const settingsStateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  const coordinateFormatHook = renderHook(
    () => useSettingsState(state => state.coordinateFormat),
    {wrapper},
  );

  // Initial state
  expect(settingsStateHook.result.current.coordinateFormat).toBe('utm');
  expect(coordinateFormatHook.result.current).toBe('utm');

  const initialSettingsState = settingsStateHook.result.current;

  act(() => {
    actionsHook.result.current.setSetting('coordinateFormat', 'dd');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    coordinateFormat: 'dd',
  });
  expect(coordinateFormatHook.result.current).toBe('dd');

  act(() => {
    actionsHook.result.current.setSetting('coordinateFormat', 'dms');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    coordinateFormat: 'dms',
  });
  expect(coordinateFormatHook.result.current).toBe('dms');

  act(() => {
    actionsHook.result.current.setSetting('coordinateFormat', 'utm');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    coordinateFormat: 'utm',
  });
  expect(coordinateFormatHook.result.current).toBe('utm');
});

test('manual entry coordinate format', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const actionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const settingsStateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  const selectedStateHook = renderHook(
    () => useSettingsState(state => state.manualCoordinateEntryFormat),
    {wrapper},
  );

  // Initial state
  expect(settingsStateHook.result.current.manualCoordinateEntryFormat).toBe(
    'utm',
  );
  expect(selectedStateHook.result.current).toBe('utm');

  const initialSettingsState = settingsStateHook.result.current;

  act(() => {
    actionsHook.result.current.setSetting('manualCoordinateEntryFormat', 'dd');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    manualCoordinateEntryFormat: 'dd',
  });
  expect(selectedStateHook.result.current).toBe('dd');

  act(() => {
    actionsHook.result.current.setSetting('manualCoordinateEntryFormat', 'dms');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    manualCoordinateEntryFormat: 'dms',
  });
  expect(selectedStateHook.result.current).toBe('dms');

  act(() => {
    actionsHook.result.current.setSetting('manualCoordinateEntryFormat', 'utm');
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    manualCoordinateEntryFormat: 'utm',
  });
  expect(selectedStateHook.result.current).toBe('utm');
});

test('metricsDiagnosticsPermissionsEnabled', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const actionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const settingsStateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  const selectedStateHook = renderHook(
    () => useSettingsState(state => state.metricsDiagnosticsPermissionsEnabled),
    {wrapper},
  );

  // Initial state
  expect(
    settingsStateHook.result.current.metricsDiagnosticsPermissionsEnabled,
  ).toBe(true);
  expect(selectedStateHook.result.current).toBe(true);

  const initialSettingsState = settingsStateHook.result.current;

  act(() => {
    actionsHook.result.current.setSetting(
      'metricsDiagnosticsPermissionsEnabled',
      false,
    );
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    metricsDiagnosticsPermissionsEnabled: false,
  });
  expect(selectedStateHook.result.current).toBe(false);

  act(() => {
    actionsHook.result.current.setSetting(
      'metricsDiagnosticsPermissionsEnabled',
      true,
    );
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    metricsDiagnosticsPermissionsEnabled: true,
  });
  expect(selectedStateHook.result.current).toBe(true);
});

test('locale', () => {
  const settingsStore = createSettingsStore();
  const wrapper = createWrapper(settingsStore);

  const actionsHook = renderHook(() => useSettingsActions(), {
    wrapper,
  });

  const settingsStateHook = renderHook(() => useSettingsState(), {
    wrapper,
  });

  const selectedStateHook = renderHook(
    () => useSettingsState(state => state.locale),
    {wrapper},
  );

  // Initial state
  expect(settingsStateHook.result.current.locale).toBe(null);
  expect(selectedStateHook.result.current).toBe(null);

  const initialSettingsState = settingsStateHook.result.current;

  act(() => {
    actionsHook.result.current.setSetting('locale', {
      languageTag: 'pt-BR',
    });
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    locale: {
      languageTag: 'pt-BR',
    },
  });
  expect(selectedStateHook.result.current).toStrictEqual({
    languageTag: 'pt-BR',
  });

  act(() => {
    actionsHook.result.current.setSetting('locale', null);
  });

  expect(settingsStateHook.result.current).toStrictEqual({
    ...initialSettingsState,
    locale: null,
  });
  expect(selectedStateHook.result.current).toBe(null);
});
