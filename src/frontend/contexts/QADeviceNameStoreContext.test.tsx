import React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createQADeviceNameStore,
  type QADeviceNameStore,
  QADeviceNameStoreContext,
} from './QADeviceNameStoreContext';
import {SetQADeviceNameScreen} from '../screens/SetQADeviceName';

function createWrapper(store: QADeviceNameStore) {
  return ({children}: {children: ReactNode}) => (
    <QADeviceNameStoreContext value={store}>
      {children}
    </QADeviceNameStoreContext>
  );
}

test('QA device name is null by default — screen should be shown', () => {
  const store = createQADeviceNameStore();
  expect(store.instance.getState().qaDeviceName).toBeNull();
});

test('SetQADeviceName screen renders when no name is set', () => {
  const store = createQADeviceNameStore();
  const wrapper = createWrapper(store);

  render(<SetQADeviceNameScreen />, {wrapper});

  expect(screen.getByText('Set QA Device Name')).toBeOnTheScreen();
  expect(screen.getByTestId('SET_QA_DEVICE_NAME.name-input')).toBeOnTheScreen();
});

test('saving a name updates the store and clears the gate', async () => {
  const store = createQADeviceNameStore();
  const wrapper = createWrapper(store);

  render(<SetQADeviceNameScreen />, {wrapper});

  const user = userEvent.setup();
  await user.type(
    screen.getByTestId('SET_QA_DEVICE_NAME.name-input'),
    'cindy-pixel-7',
  );
  await user.press(screen.getByText('Save Name'));

  expect(store.instance.getState().qaDeviceName).toBe('cindy-pixel-7');
});

test('screen shows error when Save Name is pressed with empty input', async () => {
  const store = createQADeviceNameStore();
  const wrapper = createWrapper(store);

  render(<SetQADeviceNameScreen />, {wrapper});

  const user = userEvent.setup();
  await user.press(screen.getByText('Save Name'));

  expect(
    screen.getByText('Please enter a name before saving.'),
  ).toBeOnTheScreen();
  expect(store.instance.getState().qaDeviceName).toBeNull();
});
