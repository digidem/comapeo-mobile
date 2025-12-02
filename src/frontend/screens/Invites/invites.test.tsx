import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';
import {randomBytes} from 'node:crypto';
import {pEvent} from 'p-event';
import {MEMBER_ROLE_ID} from '../../sharedTypes';
import {
  connectPeers,
  createManager,
  setUpIPC,
  inviteToProject,
} from '../../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../../tests/integration/helpers/react';
import {act, render, screen, userEvent} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AppStackParamsList} from '../../sharedTypes/navigation';
import {YourTeam} from '../YourTeam';
import {SelectDevice} from '../YourTeam/SelectDevice';
import {SelectInviteeRole} from '../YourTeam/SelectInviteeRole';
import {ReviewAndInvite} from '../YourTeam/ReviewAndInvite';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import React from 'react';
import {sleep} from '../../lib/sleep';

jest.mock('../../hooks/useCurrentTime');

describe('Invite Integration Tests', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];
  let projectId: string;

  beforeEach(async () => {
    onTeardown = [];

    const managerSetup = await createManager({
      name: 'test',
      deviceType: 'mobile',
    });
    manager = managerSetup.manager;
    const {fastifyController} = managerSetup;

    const ipcSetup = setUpIPC({manager});
    client = ipcSetup.client;
    const {stop} = ipcSetup;
    onTeardown.push(stop);

    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());
    projectId = await client.createProject({name: 'Test Project'});
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  test('receiving and accepting an invite using helper', async () => {
    // not sure if this is needed or useful at all.
    const project = await client.getProject(projectId);

    const {manager: otherManager} = await createManager({
      name: 'other',
      deviceType: 'mobile',
    });

    const disconnect = await connectPeers([manager, otherManager]);
    onTeardown.push(disconnect);

    await inviteToProject(project, otherManager);

    const otherProject = await otherManager.getProject(projectId);
    expect(otherProject).toBeDefined();
  });

  test('render Team screen and click Invite Device button', async () => {
    // not sure if this is useful at all.
    const user = userEvent.setup();

    const Stack =
      createNativeStackNavigator<Pick<AppStackParamsList, 'YourTeam'>>();

    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      activeProjectId: projectId,
    });
    onTeardown.push(appProviders.teardown);

    const {unmount} = render(
      <React.Suspense fallback={null}>
        <ActiveProjectProvider activeProjectId={projectId}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="YourTeam" component={YourTeam} />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveProjectProvider>
      </React.Suspense>,
      {
        wrapper: appProviders.wrapper,
      },
    );

    onTeardown.unshift(unmount);

    await expect(screen.findByText('Coordinators')).resolves.toBeVisible();
    const inviteButton = await screen.findByTestId('PROJECT.invite-device-btn');
    expect(inviteButton).toBeVisible();
    await user.press(inviteButton);
  });

  test('navigate through invite UI flow', async () => {
    const user = userEvent.setup();
    const {manager: inviteeManager, fastifyController: inviteeFastify} =
      await createManager({
        name: 'invitee-device',
        deviceType: 'mobile',
      });

    await inviteeFastify.start();
    onTeardown.push(() => inviteeFastify.stop());

    const inviteeIpcSetup = setUpIPC({manager: inviteeManager});
    onTeardown.push(inviteeIpcSetup.stop);

    const disconnect = await connectPeers([manager, inviteeManager]);
    onTeardown.push(disconnect);

    const Stack =
      createNativeStackNavigator<
        Pick<
          AppStackParamsList,
          'YourTeam' | 'SelectDevice' | 'SelectInviteeRole' | 'ReviewAndInvite'
        >
      >();

    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      activeProjectId: projectId,
    });
    onTeardown.push(appProviders.teardown);

    const {unmount} = render(
      <React.Suspense fallback={null}>
        <ActiveProjectProvider activeProjectId={projectId}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="YourTeam" component={YourTeam} />
              <Stack.Screen name="SelectDevice" component={SelectDevice} />
              <Stack.Screen
                name="SelectInviteeRole"
                component={SelectInviteeRole}
              />
              <Stack.Screen
                name="ReviewAndInvite"
                component={ReviewAndInvite}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ActiveProjectProvider>
      </React.Suspense>,
      {
        wrapper: appProviders.wrapper,
      },
    );

    onTeardown.unshift(unmount);

    await expect(screen.findByText('Coordinators')).resolves.toBeVisible();
    const inviteButton = await screen.findByTestId('PROJECT.invite-device-btn');

    await act(async () => {
      await user.press(inviteButton);
    });
    await expect(
      screen.findByText('Not seeing a Device?'),
    ).resolves.toBeVisible();

    await act(async () => {
      await sleep(500);
    });

    const inviteeDeviceButton = await screen.findByText('invitee-device');
    await user.press(inviteeDeviceButton);
    await expect(
      screen.findByText('You are selecting a role for this device:'),
    ).resolves.toBeVisible();
    expect(screen.getByTestId('role-card-participant')).toBeDefined();
    expect(screen.getByTestId('role-card-coordinator')).toBeDefined();
    const participantRoleCard = await screen.findByTestId(
      'role-card-participant',
    );
    await user.press(participantRoleCard);
    await expect(screen.findByText('You are inviting:')).resolves.toBeVisible();
    const sendButton = await screen.findByText('Send Invite');
    expect(sendButton).toBeDefined();
  });

  test('receiving an invite and then accepting it', async () => {
    const testProjectId = await client.createProject({name: 'test project'});
    const project = await client.getProject(testProjectId);

    const {manager: inviteeManager} = await createManager({
      name: 'invitee',
      deviceType: 'mobile',
    });

    const disconnect = await connectPeers([manager, inviteeManager]);
    onTeardown.push(disconnect);

    const inviteId = randomBytes(32);
    let receivedInvite = null;
    const inviteeInvitePromise = pEvent(
      inviteeManager.invite,
      'invite-received',
      invite => Buffer.from(invite.inviteId, 'hex').equals(inviteId),
    );

    await Promise.all([
      project.$member.invite(inviteeManager.deviceId, {
        roleId: MEMBER_ROLE_ID,
        __testOnlyInviteId: inviteId,
      }),
      (async () => {
        receivedInvite = await inviteeInvitePromise;
        expect(receivedInvite).toBeDefined();
        expect(receivedInvite.inviteId).toBe(inviteId.toString('hex'));
        expect(receivedInvite.projectName).toBe('test project');

        const invites = inviteeManager.invite.getMany();
        expect(invites).toHaveLength(1);
        expect(invites[0]?.inviteId).toBe(inviteId.toString('hex'));

        await expect(
          inviteeManager.getProject(testProjectId),
        ).rejects.toThrow();
        await inviteeManager.invite.accept(receivedInvite);
      })(),
    ]);
    const inviteeProject = await inviteeManager.getProject(testProjectId);
    expect(inviteeProject).toBeDefined();
  });

  test('rejecting an invite', async () => {
    const testProjectId = await client.createProject({name: 'test project'});
    const project = await client.getProject(testProjectId);

    const {manager: inviteeManager} = await createManager({
      name: 'invitee',
      deviceType: 'mobile',
    });

    const disconnect = await connectPeers([manager, inviteeManager]);
    onTeardown.push(disconnect);
    const inviteId = randomBytes(32);
    let receivedInvite = null;
    const inviteeInvitePromise = pEvent(
      inviteeManager.invite,
      'invite-received',
      invite => Buffer.from(invite.inviteId, 'hex').equals(inviteId),
    );

    await Promise.all([
      project.$member.invite(inviteeManager.deviceId, {
        roleId: MEMBER_ROLE_ID,
        __testOnlyInviteId: inviteId,
      }),
      (async () => {
        receivedInvite = await inviteeInvitePromise;
        expect(receivedInvite).toBeDefined();
        expect(receivedInvite.projectName).toBe('test project');
        const invitesBeforeReject = inviteeManager.invite.getMany();
        expect(invitesBeforeReject).toHaveLength(1);
        await inviteeManager.invite.reject(receivedInvite);
      })(),
    ]);

    await expect(inviteeManager.getProject(testProjectId)).rejects.toThrow();
  });
});
