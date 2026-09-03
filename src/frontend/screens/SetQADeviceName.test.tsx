import React from 'react';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {ComapeoCoreClientApi} from '@comapeo/ipc';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {AppNavigator} from '../AppNavigator';

// Simulate a QA build so the SetQADeviceName gate is active
jest.mock('../lib/appVariant', () => ({
  APP_VARIANT: 'releaseCandidate',
  isQABuild: true,
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
  let client: ComapeoCoreClientApi;
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

  it('shows SetQADeviceName screen when no QA name is set', async () => {
    const app = createAppProvidersWrapper({mapeoApi: client});
    onTeardown.push(app.teardown);

    const {unmount} = await render(
      <React.Suspense fallback={null}>
        <AppNavigator
          permissionAsked={false}
          navigationIntegration={undefined}
        />
      </React.Suspense>,
      {wrapper: app.wrapper},
    );
    onTeardown.unshift(unmount);

    await waitFor(() => {
      expect(screen.getByText('Set QA Device Name')).toBeOnTheScreen();
    });
    expect(
      screen.getByTestId('SET_QA_DEVICE_NAME.name-input'),
    ).toBeOnTheScreen();
  });

  it('does not show SetQADeviceName screen when a QA name is already set', async () => {
    const app = createAppProvidersWrapper({
      mapeoApi: client,
      qaDeviceName: 'my-qa-device',
    });
    onTeardown.push(app.teardown);

    const {unmount} = await render(
      <React.Suspense fallback={null}>
        <AppNavigator
          permissionAsked={false}
          navigationIntegration={undefined}
        />
      </React.Suspense>,
      {wrapper: app.wrapper},
    );
    onTeardown.unshift(unmount);

    await waitFor(() => {
      expect(screen.queryByText('Set QA Device Name')).not.toBeOnTheScreen();
    });
  });

  it('saves the QA name and clears the gate', async () => {
    const app = createAppProvidersWrapper({mapeoApi: client});
    onTeardown.push(app.teardown);

    const {unmount} = await render(
      <React.Suspense fallback={null}>
        <AppNavigator
          permissionAsked={false}
          navigationIntegration={undefined}
        />
      </React.Suspense>,
      {wrapper: app.wrapper},
    );
    onTeardown.unshift(unmount);

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

    // Gate is cleared — mock has device name but no project, so lands on Success screen.
    await waitFor(() => {
      expect(screen.queryByText('Set QA Device Name')).not.toBeOnTheScreen();
    });
    expect(screen.getByText('Map On Your Own')).toBeOnTheScreen();
  });
});
