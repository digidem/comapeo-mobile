import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text} from 'react-native';

import {
  createManager,
  setUpIPC,
} from '../../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';
import {sleep} from '../../lib/sleep';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import type {AppStackParamsList} from '../../sharedTypes/navigation';
import {LeaveProject} from './LeaveProject';

const Stack =
  createNativeStackNavigator<
    Pick<
      AppStackParamsList,
      'LeaveProject' | 'Home' | 'LeftProjectConfirmation' | 'ErrorBottomSheet'
    >
  >();

function ActiveProjectIdProbe() {
  const activeProjectId = useActiveProjectId();
  return <Text>{`active:${activeProjectId}`}</Text>;
}

function LeftProjectConfirmationScreen() {
  return (
    <>
      <Text>Left project confirmation</Text>
      <ActiveProjectIdProbe />
    </>
  );
}

function HomeScreen() {
  return <Text>Home</Text>;
}

function ErrorBottomSheetScreen() {
  return <Text>Error bottom sheet</Text>;
}

describe('LeaveProject', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const managerSetup = await createManager({
      name: 'test',
      deviceType: 'mobile',
    });
    ({manager} = managerSetup);
    const {fastifyController} = managerSetup;

    const ipcSetup = setUpIPC({manager});
    ({client} = ipcSetup);
    const {stop} = ipcSetup;
    onTeardown.push(stop);

    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  function renderLeaveProjectScreen({
    activeProjectId,
  }: Readonly<{activeProjectId: string}>) {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      activeProjectId,
    });
    onTeardown.push(appProviders.teardown);

    const {unmount} = render(
      <React.Suspense fallback={null}>
        <ActiveProjectProvider activeProjectId={activeProjectId}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="LeaveProject"
                component={LeaveProject}
                initialParams={{memberType: 'participant'}}
              />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="LeftProjectConfirmation"
                component={LeftProjectConfirmationScreen}
              />
              <Stack.Screen
                name="ErrorBottomSheet"
                component={ErrorBottomSheetScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveProjectProvider>
      </React.Suspense>,
      {
        wrapper: appProviders.wrapper,
      },
    );

    // Unmount before tearing down the RPC server, so that in-flight RPC
    // requests from mounted components don't hold the test process open
    // (same workaround as in the Exchange screen tests)
    onTeardown.unshift(async () => {
      unmount();
      await sleep(0);
    });
  }

  test('leaving switches the active project to the existing default project', async () => {
    const projectToLeaveId = await client.createProject({
      name: 'shared project',
    });
    const defaultProjectId = await client.createProject();

    renderLeaveProjectScreen({activeProjectId: projectToLeaveId});

    const user = userEvent.setup();
    await user.press(await screen.findByText('Yes, Leave'));

    await expect(
      screen.findByText('Left project confirmation'),
    ).resolves.toBeVisible();
    await expect(
      screen.findByText(`active:${defaultProjectId}`),
    ).resolves.toBeVisible();

    await waitFor(async () => {
      const projects = await client.listProjects();
      expect(projects.map(p => p.projectId)).not.toContain(projectToLeaveId);
    });
  });

  test('leaving creates a default project when none exists, instead of staying on the left project', async () => {
    const projectToLeaveId = await client.createProject({
      name: 'shared project',
    });

    renderLeaveProjectScreen({activeProjectId: projectToLeaveId});

    const user = userEvent.setup();
    await user.press(await screen.findByText('Yes, Leave'));

    await expect(
      screen.findByText('Left project confirmation'),
    ).resolves.toBeVisible();

    const projects = await client.listProjects();
    expect(projects).toHaveLength(1);
    const newDefault = projects[0]!;
    expect(newDefault.name).toBeUndefined();
    expect(newDefault.projectId).not.toEqual(projectToLeaveId);

    await expect(
      screen.findByText(`active:${newDefault.projectId}`),
    ).resolves.toBeVisible();
  });
});
