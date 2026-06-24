import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createQADeviceNameStore,
  type QADeviceNameStore,
  QADeviceNameStoreProvider,
  useQADeviceName,
  useQADeviceNameActions,
} from './QADeviceNameStoreContext';

function createWrapper(store: QADeviceNameStore) {
  return ({children}: {children: ReactNode}) => (
    <QADeviceNameStoreProvider value={store}>
      {children}
    </QADeviceNameStoreProvider>
  );
}

test('initial QA device name is null (no name set)', () => {
  const store = createQADeviceNameStore();
  const wrapper = createWrapper(store);

  const {result} = renderHook(() => useQADeviceName(), {wrapper});

  expect(result.current).toBeNull();
});

test('setting a QA device name updates the store', () => {
  const store = createQADeviceNameStore();
  const wrapper = createWrapper(store);

  const nameHook = renderHook(() => useQADeviceName(), {wrapper});
  const actionsHook = renderHook(() => useQADeviceNameActions(), {wrapper});

  act(() => {
    actionsHook.result.current.setQADeviceName('cindy-pixel-7');
  });

  expect(nameHook.result.current).toBe('cindy-pixel-7');
});

test('QA device name screen should show when name is not set (QA build gate)', () => {
  const store = createQADeviceNameStore();

  // Simulate what the navigator checks: no name means the screen must be shown
  const qaDeviceName = store.instance.getState().qaDeviceName;
  expect(qaDeviceName).toBeNull();

  // After setting the name the gate should pass
  store.actions.setQADeviceName('test-device');
  const updatedName = store.instance.getState().qaDeviceName;
  expect(updatedName).toBe('test-device');
});
