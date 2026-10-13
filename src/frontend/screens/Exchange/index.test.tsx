import {act, render, screen, userEvent} from '@testing-library/react-native';

import type {MapeoManager} from '@comapeo/core';
import type {ComapeoCoreClientApi} from '@comapeo/ipc';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  connectPeers,
  createManager,
  createTestServer,
  inviteToProject,
  setUpIPC,
} from '../../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';
import {sleep} from '../../lib/sleep';
import type {AppStackParamsList} from '../../sharedTypes/navigation';
import {SyncScreen} from '.';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import React from 'react';

jest.mock('../../hooks/useCurrentTime');

describe('Exchange screen', () => {
  let manager: MapeoManager;
  let client: ComapeoCoreClientApi;
  let onTeardown: Array<() => unknown> = [];
  let projectId: string;

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
    projectId = await client.createProject({name: undefined});
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  const Stack = createNativeStackNavigator<Pick<AppStackParamsList, 'Sync'>>();

  const renderSyncScreen = async ({
    isOnline = true,
    activeProjectId = projectId,
  }: Readonly<{isOnline?: boolean; activeProjectId?: string}> = {}) => {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
      activeProjectId,
    });
    onTeardown.push(appProviders.teardown);

    const {unmount} = await render(
      <React.Suspense fallback={null}>
        <ActiveProjectProvider activeProjectId={activeProjectId}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Sync" component={SyncScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveProjectProvider>
      </React.Suspense>,
      {
        wrapper: appProviders.wrapper,
      },
    );

    // When the sync screen is unfocused, it makes a cleanup request via RPC.
    // Without this test cleanup happening first, the following can happen:
    //
    // 1. The component is unfocused.
    // 2. The RPC server is destroyed.
    // 3. The component's RPC client request is made, which never completes
    //    because the RPC server is stopped.
    //
    // This deferral works around that problem. It's a little clunky, I admit.
    // But it's the only solution that worked for me, without adding test-only
    // code to the component.
    const actualTeardown = async () => {
      await unmount();
      await sleep(0);
    };

    onTeardown.unshift(actualTeardown);

    return () => {
      const result = actualTeardown();
      onTeardown = onTeardown.filter(fn => fn !== actualTeardown);
      return result;
    };
  };

  test('when project is in "solo mode", renders a screen with info', async () => {
    await renderSyncScreen({activeProjectId: projectId});

    await expect(screen.findByText('Exchange')).resolves.toBeVisible();
    await expect(
      screen.findByText(
        'Invite collaborators to your project from the main menu',
      ),
    ).resolves.toBeVisible();
  });

  test('shows "no Wi-Fi screen" when no Wi-Fi connection is available and there is no remote archive', async () => {
    // Create project with another device

    const projectId = await client.createProject({name: 'test project'});
    const project = await client.getProject(projectId);

    const {manager: otherManager} = await createManager({
      name: 'other',
      deviceType: 'mobile',
    });

    const disconnect = await connectPeers([manager, otherManager]);
    onTeardown.push(disconnect);
    await inviteToProject(project, otherManager);
    await project.$sync.waitForSync('initial');
    const otherProject = await otherManager.getProject(projectId);
    await otherProject.$sync.waitForSync('initial');
    await disconnect();
    onTeardown = onTeardown.filter(fn => fn !== disconnect);

    // Render the sync screen

    await renderSyncScreen({isOnline: false, activeProjectId: projectId});

    await expect(screen.findByText('No Wi-Fi.')).resolves.toBeVisible();
  });

  test("shows sync screen if there's a remote archive, even if Wi-Fi is off", async () => {
    const projectId = await client.createProject({name: 'test project'});
    const project = await client.getProject(projectId);

    const {serverBaseUrl, close} = await createTestServer();
    onTeardown.push(close);

    await project.$member.addServerPeer(serverBaseUrl, {
      dangerouslyAllowInsecureConnections: true,
    });

    await renderSyncScreen({isOnline: false, activeProjectId: projectId});

    await expect(
      screen.findByText('Remote Archive connected'),
    ).resolves.toBeVisible();
    await expect(screen.findByText('Start')).resolves.toBeVisible();
  });

  test('syncing data between two devices', async () => {
    // General test support

    const user = userEvent.setup();

    let onTeardownDisconnect: () => unknown = () => {};
    onTeardown.push(() => onTeardownDisconnect());

    // Create project, invite other simulated device

    const projectId = await client.createProject({name: 'test project'});
    const project = await client.getProject(projectId);

    const {manager: otherManager} = await createManager({
      name: 'other',
      deviceType: 'mobile',
    });
    const managers = [manager, otherManager];

    const disconnect1 = await connectPeers(managers);
    onTeardownDisconnect = disconnect1;

    await inviteToProject(project, otherManager);

    const otherProject = await otherManager.getProject(projectId);
    otherProject.$sync.start();
    onTeardown.push(() => {
      otherProject.$sync.stop();
    });

    await project.$sync.waitForSync('initial');
    await otherProject.$sync.waitForSync('initial');

    await disconnect1();
    onTeardownDisconnect = () => {};

    // Create observations on both devices, which should not yet be synced

    const myObservation = await project.observation.create({
      schemaName: 'observation',
      lat: 12,
      lon: 34,
      attachments: [],
      tags: {},
    });
    const otherObservation = await otherProject.observation.create({
      schemaName: 'observation',
      lat: 56,
      lon: 78,
      attachments: [],
      tags: {},
    });

    const expectObservationsNotToBeSynced = () =>
      Promise.all([
        expect(
          project.observation.getByDocId(otherObservation.docId),
        ).rejects.toThrow(),
        expect(
          otherProject.observation.getByDocId(myObservation.docId),
        ).rejects.toThrow(),
      ]);

    await expectObservationsNotToBeSynced();

    // Render the sync screen, which should show no connection

    await renderSyncScreen({activeProjectId: projectId});

    expect(await screen.findByText('CoMapeo Test Wi-Fi')).toBeVisible();
    expect(await screen.findByText('No devices found.')).toBeVisible();

    // Connect peers, which should change the screen

    onTeardownDisconnect = await act(async () => {
      const disconnect2 = await connectPeers(managers);
      await expectObservationsNotToBeSynced();
      return disconnect2;
    });

    expect(await screen.findByText('Devices found.')).toBeVisible();

    // Start sync and verify that observations are exchanged

    await user.press(screen.getByText('Start'));

    expect(await screen.findByText('Stop')).toBeVisible();

    await act(async () => {
      await project.$sync.waitForSync('full');
      await otherProject.$sync.waitForSync('full');
    });

    await expect(
      project.observation.getByDocId(otherObservation.docId),
    ).resolves.toBeDefined();
    await expect(
      otherProject.observation.getByDocId(myObservation.docId),
    ).resolves.toBeDefined();

    expect(await screen.findByText('Complete!')).toBeVisible();
  });
});
