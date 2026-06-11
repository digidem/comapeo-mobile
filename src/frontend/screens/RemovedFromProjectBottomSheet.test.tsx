import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {Text} from 'react-native';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {sleep} from '../lib/sleep';
import {ActiveProjectProvider} from '../contexts/ActiveProjectContext';
import {useActiveProjectId} from '../contexts/ActiveProjectIdStoreContext';
import type {AppStackParamsList} from '../sharedTypes/navigation';
import {RemovedFromProjectBottomSheet} from './RemovedFromProjectBottomSheet';

const Stack =
  createNativeStackNavigator<
    Pick<
      AppStackParamsList,
      'Home' | 'RemovedFromProjectBottomSheet' | 'ErrorBottomSheet'
    >
  >();

function ActiveProjectIdProbe() {
  const activeProjectId = useActiveProjectId();
  return <Text>{`active:${activeProjectId}`}</Text>;
}

function HomeScreen() {
  return (
    <>
      <Text>Home</Text>
      <ActiveProjectIdProbe />
    </>
  );
}

function ErrorBottomSheetScreen() {
  return <Text>Error bottom sheet</Text>;
}

describe('RemovedFromProjectBottomSheet', () => {
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

  function renderRemovedBottomSheet({
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
          {/* Same stack shape as ProjectRemovalListener's reset dispatch */}
          <NavigationContainer
            initialState={{
              routes: [{name: 'Home'}, {name: 'RemovedFromProjectBottomSheet'}],
              index: 1,
            }}>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="RemovedFromProjectBottomSheet"
                component={RemovedFromProjectBottomSheet}
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

  test('closing switches the active project to the existing default project', async () => {
    const removedProjectId = await client.createProject({
      name: 'removed project',
    });
    const defaultProjectId = await client.createProject();

    renderRemovedBottomSheet({activeProjectId: removedProjectId});

    const closeButton = await screen.findByText('Close');
    fireEvent.press(closeButton);

    await expect(
      screen.findByText(`active:${defaultProjectId}`),
    ).resolves.toBeVisible();

    await waitFor(async () => {
      const projects = await client.listProjects();
      expect(projects.map(p => p.projectId)).not.toContain(removedProjectId);
    });
  });

  test('double-tapping Close creates at most one default project', async () => {
    const removedProjectId = await client.createProject({
      name: 'removed project',
    });

    renderRemovedBottomSheet({activeProjectId: removedProjectId});

    const closeButton = await screen.findByText('Close');
    // Two presses can land before the re-render that hides the button (#1940).
    // Both presses go in one act() block so no re-render happens between
    // them, like a real double-tap on a busy JS thread
    act(() => {
      fireEvent.press(closeButton);
      fireEvent.press(closeButton);
    });

    await waitFor(
      async () => {
        const projects = await client.listProjects();
        expect(projects.map(p => p.projectId)).not.toContain(removedProjectId);
        const unnamed = projects.filter(project => !project.name);
        expect(unnamed).toHaveLength(1);
        expect(projects).toHaveLength(1);
      },
      {timeout: 10_000},
    );

    await expect(screen.findByText(/^active:/)).resolves.toBeVisible();
  });
});
