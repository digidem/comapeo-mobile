import {act, render, screen, userEvent} from '@testing-library/react-native';

import {SyncScreen} from './Exchange';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi, MapeoProjectApi} from '@comapeo/ipc';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {randomBytes} from 'node:crypto';
import {pEvent} from 'p-event';
import pEvery from 'p-every';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';
import {sleep} from '../lib/sleep';
import {MEMBER_ROLE_ID} from '../sharedTypes';
import type {AppStackParamsList} from '../sharedTypes/navigation';

jest.mock('../hooks/useCurrentTime');

describe('Exchange screen', () => {
  let appProviders: ReturnType<typeof createAppProvidersWrapper>;
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

    appProviders = createAppProvidersWrapper({mapeoApi: client});
    onTeardown.push(appProviders.teardown);
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  const Stack = createNativeStackNavigator<Pick<AppStackParamsList, 'Sync'>>();

  const renderSyncScreen = () => {
    const {unmount} = render(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Sync" component={SyncScreen} />
        </Stack.Navigator>
      </NavigationContainer>,
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
    onTeardown.unshift(async () => {
      unmount();
      await sleep(0);
    });
  };

  test('when project is in "solo mode", renders a screen with info', async () => {
    renderSyncScreen();

    await expect(screen.findByText('Exchange')).resolves.toBeVisible();
    await expect(
      screen.findByText(
        'Invite collaborators to your project from the main menu',
      ),
    ).resolves.toBeVisible();
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

    renderSyncScreen();

    expect(await screen.findByText('CoMapeo Test Wi-Fi')).toBeVisible();
    expect(
      await screen.findByText('No devices available to sync'),
    ).toBeVisible();

    // Connect peers, which should change the screen

    onTeardownDisconnect = await act(async () => {
      const disconnect2 = await connectPeers(managers);
      await expectObservationsNotToBeSynced();
      return disconnect2;
    });

    expect(await screen.findByText('Ready to exchange')).toBeVisible();

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

    expect(
      await screen.findByText("Complete! You're up to date"),
    ).toBeVisible();
  });
});

async function connectPeers(
  managers: ReadonlyArray<MapeoManager>,
): Promise<() => Promise<void>> {
  await tellPeersAboutEachOther(managers);
  await waitForPeersToBeConnected(managers);
  return () => stopPeerDiscovery(managers);
}

async function tellPeersAboutEachOther(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  await Promise.all(
    managers.map(async manager => {
      const {name, port} = await manager.startLocalPeerDiscoveryServer();
      for (const otherManager of managers) {
        if (otherManager === manager) continue;
        otherManager.connectLocalPeer({address: '127.0.0.1', name, port});
      }
    }),
  );
}

async function waitForPeersToBeConnected(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  const deviceIds = new Set(managers.map(m => m.deviceId));

  const isDone = async (): Promise<boolean> =>
    pEvery(managers, async manager => {
      const unconnectedDeviceIds = new Set(deviceIds);
      unconnectedDeviceIds.delete(manager.deviceId);
      for (const peer of await manager.listLocalPeers()) {
        if (peer.status === 'connected') {
          unconnectedDeviceIds.delete(peer.deviceId);
        }
      }
      return unconnectedDeviceIds.size === 0;
    });

  if (await isDone()) return;

  return new Promise(res => {
    const onLocalPeers = async () => {
      if (await isDone()) {
        for (const manager of managers) {
          manager.off('local-peers', onLocalPeers);
        }
        res();
      }
    };
    for (const manager of managers) manager.on('local-peers', onLocalPeers);
  });
}

async function stopPeerDiscovery(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  await Promise.all(
    managers.map(manager =>
      manager.stopLocalPeerDiscoveryServer({force: true}),
    ),
  );
}

async function inviteToProject(
  project: MapeoProjectApi,
  invitee: MapeoManager,
): Promise<void> {
  const inviteId = randomBytes(32);

  const inviteeInvitePromise = pEvent(
    invitee.invite,
    'invite-received',
    invite => Buffer.from(invite.inviteId, 'hex').equals(inviteId),
  );

  await Promise.all([
    project.$member.invite(invitee.deviceId, {
      roleId: MEMBER_ROLE_ID,
      __testOnlyInviteId: inviteId,
    }),
    (async () => {
      const invite = await inviteeInvitePromise;
      await invitee.invite.accept(invite);
    })(),
  ]);
}
