import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@testing-library/react-native';

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

    const r = render(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Root" component={RootStackNavigator} />
        </Stack.Navigator>
      </NavigationContainer>,
      {wrapper: appProviders.wrapper},
    );
    const unmountSafely = async () => {
      r.unmount();
      await new Promise(res => setTimeout(res, 0));
    };

    onTeardown.unshift(unmountSafely);

    return {...r, unmountSafely};
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

  it('creates a project during onboarding and switches to the main app', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});
    const user = userEvent.setup();
    renderRoot();

    await expect(
      screen.findByText('Secure & Private Collaborations'),
    ).resolves.toBeVisible();

    await user.press(await screen.findByText('Start a New Project'));

    await user.press(await screen.findByText('Start'));

    const input = await screen.findByTestId('PROJECT.name-inp');
    await user.type(input, 'Test Project');
    await user.press(screen.getByText('Next'));

    await waitFor(async () => {
      const projects = await client.listProjects();
      if (projects.length !== 1) {
        throw new Error('Project not created yet');
      }
    });
    const [project] = await client.listProjects();
    expect(project?.name).toBe('Test Project');
    await expect(screen.findByTestId('MAIN.map-screen')).resolves.toBeVisible();
  });

  it('does not create a project when name is blank/whitespace', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    const user = userEvent.setup();
    renderRoot();

    await user.press(
      await screen.findByText('Secure & Private Collaborations'),
    );
    await user.press(screen.getByText('Start a New Project'));
    await user.press(await screen.findByText('Start'));

    const input = await screen.findByTestId('PROJECT.name-inp');
    await user.clear(input);
    await user.type(input, '     ');
    await user.press(screen.getByTestId('PROJECT.submit-btn'));

    await waitFor(async () => {
      const projects = await client.listProjects();
      if (projects.length !== 0) throw new Error('Unexpected project creation');
    });

    expect(screen.getByTestId('PROJECT.name-inp')).toBeVisible();
  });

  it('Map Solo creates exactly one default (unnamed) project on quick double press', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});
    const user = userEvent.setup();
    const {unmountSafely} = renderRoot();

    await user.press(await screen.findByText('Go to Map'));
    await screen.findByText('Map on Your Own');

    const start = await screen.findByText('Start Mapping');
    await user.press(start);

    const maybeStart = screen.queryByText('Start Mapping');
    if (maybeStart) {
      await user.press(maybeStart);
    }

    await waitFor(async () => {
      const projects = await client.listProjects();
      if (projects.length !== 1) throw new Error('Project not created yet');
    });

    const [proj] = await client.listProjects();
    expect(proj?.name).toBeUndefined();
    await expect(screen.findByTestId('MAIN.map-screen')).resolves.toBeVisible();

    await unmountSafely();
  });

  it('shows error bottom sheet when project creation fails', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    const orig = manager.createProject.bind(manager);
    const spy = jest
      .spyOn(manager, 'createProject')
      .mockImplementationOnce(async () => {
        throw new Error('boom');
      })
      .mockImplementation(
        async (opts: Parameters<typeof manager.createProject>[0]) => {
          return orig(opts);
        },
      );

    const {unmountSafely} = renderRoot();

    const user = userEvent.setup();
    await user.press(await screen.findByText('Start a New Project'));
    await user.press(await screen.findByText('Start'));

    const input = await screen.findByTestId('PROJECT.name-inp');
    await user.type(input, 'My Project');
    await user.press(screen.getByTestId('PROJECT.submit-btn'));
    await expect(
      screen.findByTestId('ERROR.bottom-sheet'),
    ).resolves.toBeVisible();

    const sheet = screen.getByTestId('ERROR.bottom-sheet');
    await user.press(within(sheet).getByText('Go Back'));

    await user.press(await screen.findByTestId('PROJECT.submit-btn'));

    await waitFor(async () => {
      const projects = await client.listProjects();
      if (projects.length !== 1) throw new Error('Project not created yet');
    });

    spy.mockRestore();
    await unmountSafely();
  });

  it('after a device has been named, goes to Map when a project exists', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    await client.createProject({name: 'First Project'});
    renderRoot();

    await expect(screen.findByTestId('MAIN.map-screen')).resolves.toBeVisible();
  });

  it('only creates a single project on rapid double-tap', async () => {
    await client.setDeviceInfo({name: 'My Device', deviceType: 'mobile'});

    let callCount = 0;
    const orig = manager.createProject.bind(manager);
    const spy = jest
      .spyOn(manager, 'createProject')
      .mockImplementation(
        async (opts: Parameters<typeof manager.createProject>[0]) => {
          callCount += 1;
          await new Promise(r => setTimeout(r, 200));
          return orig(opts);
        },
      );

    const {unmountSafely} = renderRoot();

    const user = userEvent.setup();
    await user.press(await screen.findByText('Start a New Project'));
    await user.press(await screen.findByText('Start'));

    const input = await screen.findByTestId('PROJECT.name-inp');
    await user.type(input, 'Racey Project');

    const submit = screen.getByTestId('PROJECT.submit-btn');

    await user.press(submit);
    if (screen.queryByTestId('PROJECT.submit-btn')) {
      await user.press(submit);
    }

    await waitFor(async () => {
      const projects = await client.listProjects();
      if (projects.length !== 1) throw new Error('Project not created yet');
    });

    expect(callCount).toBe(1);

    spy.mockRestore();
    await unmountSafely();
  });
});
