import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {RootStackNavigator} from '../Navigation/Stack';
import {createQADeviceNameStore} from '../contexts/QADeviceNameStoreContext';

// Simulate a QA build so the SetQADeviceName gate is active
jest.mock('../lib/appVariant', () => ({
  APP_VARIANT: 'releaseCandidate',
}));

jest.mock('@comapeo/core-react', () => {
  const actual = jest.requireActual('@comapeo/core-react');
  return {
    ...actual,
    useOwnDeviceInfo: () => ({
      data: {name: 'test-device', deviceType: 'mobile'},
    }),
  };
});

describe('On QA Device require existence of a QA Device name', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const {manager: mgr, fastifyController} = await createManager({
      name: 'test-device',
      deviceType: 'mobile',
    });
    manager = mgr;

    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());

    const ipc = setUpIPC({manager});
    client = ipc.client;
    onTeardown.push(ipc.stop);
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  it('shows SetQADeviceName screen when no QA name is set in store', async () => {
    const qaDeviceNameStore = createQADeviceNameStore({persist: false});
    // qaDeviceNameStore starts with null

    const app = createAppProvidersWrapper({
      mapeoApi: client,
      qaDeviceNameStore,
    });
    onTeardown.push(app.teardown);

    render(
      <NavigationContainer>
        <React.Suspense fallback={null}>
          <RootStackNavigator />
        </React.Suspense>
      </NavigationContainer>,
      {wrapper: app.wrapper},
    );

    await waitFor(() => {
      expect(screen.getByText('Set QA Device Name')).toBeOnTheScreen();
    });
    expect(
      screen.getByTestId('SET_QA_DEVICE_NAME.name-input'),
    ).toBeOnTheScreen();
  });

  it('does not show SetQADeviceName screen when a QA name is already set', async () => {
    const qaDeviceNameStore = createQADeviceNameStore({persist: false});
    qaDeviceNameStore.actions.setQADeviceName('my-qa-device');

    const app = createAppProvidersWrapper({
      mapeoApi: client,
      qaDeviceNameStore,
    });
    onTeardown.push(app.teardown);

    render(
      <NavigationContainer>
        <React.Suspense fallback={null}>
          <RootStackNavigator />
        </React.Suspense>
      </NavigationContainer>,
      {wrapper: app.wrapper},
    );

    await waitFor(() => {
      expect(screen.queryByText('Set QA Device Name')).not.toBeOnTheScreen();
    });
  });

  it('saves the QA name and clears the gate', async () => {
    const qaDeviceNameStore = createQADeviceNameStore({persist: false});

    const app = createAppProvidersWrapper({
      mapeoApi: client,
      qaDeviceNameStore,
    });
    onTeardown.push(app.teardown);

    render(
      <NavigationContainer>
        <React.Suspense fallback={null}>
          <RootStackNavigator />
        </React.Suspense>
      </NavigationContainer>,
      {wrapper: app.wrapper},
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('SET_QA_DEVICE_NAME.name-input'),
      ).toBeOnTheScreen();
    });

    const user = userEvent.setup();
    await user.type(
      screen.getByTestId('SET_QA_DEVICE_NAME.name-input'),
      'my-qa-device',
    );
    await user.press(screen.getByText('Save Name'));

    expect(qaDeviceNameStore.instance.getState().qaDeviceName).toBe(
      'my-qa-device',
    );

    // Gate is cleared — SetQADeviceName should be gone and onboarding should appear.
    await waitFor(() => {
      expect(screen.queryByText('Set QA Device Name')).not.toBeOnTheScreen();
    });
    expect(screen.getByText('Get Started')).toBeOnTheScreen();
  });
});
