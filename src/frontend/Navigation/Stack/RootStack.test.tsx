import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {render, screen} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {
  createManager,
  setUpIPC,
} from '../../../../tests/integration/helpers/core.ts';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';
import {RootStackNavigator} from './index';

const Stack = createNativeStackNavigator<{Root: undefined}>();

describe('Root navigation onboarding → next screen', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const {manager: mgr, fastifyController} = await createManager({
      name: '',
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

  function renderRoot({isOnline = true}: {isOnline?: boolean} = {}) {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
    });
    onTeardown.push(appProviders.teardown);

    return render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Root" component={RootStackNavigator} />
        </Stack.Navigator>
      </NavigationContainer>,
      {wrapper: appProviders.wrapper},
    );
  }

  it('without a device name, goes to the intro to comapeo screen', async () => {
    renderRoot();
    await expect(
      screen.findByText('Map your world, together'),
    ).resolves.toBeVisible();
  });

  it('after device naming, shows the Project Onboarding screens if no projects exist', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    renderRoot();
    await expect(
      screen.findByText('Secure & Private Collaborations'),
    ).resolves.toBeVisible();
  });

  it('after a device has been named, goes to Map when a project exists', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    await client.createProject({name: 'First Project'});
    renderRoot();

    await expect(screen.findByTestId('MAIN.map-screen')).resolves.toBeVisible();
  });
});
