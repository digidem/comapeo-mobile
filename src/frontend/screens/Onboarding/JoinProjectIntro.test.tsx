import {userEvent, screen} from '@testing-library/react-native';
import {
  setupIntegrationTest,
  setupIntegrationTestWithoutProject,
} from '../../../../tests/integration/helpers/setupIntegrationTest';
import {randomBytes} from 'node:crypto';
import {MEMBER_ROLE_ID} from '../../sharedTypes';
import {connectPeers} from '../../../../tests/integration/helpers/core';

describe('Onboarding Screens', () => {
  const inviteeSetup = setupIntegrationTestWithoutProject();
  const invitorSetup = setupIntegrationTest();

  test('should show success screen after being invited to project', async () => {
    const user = userEvent.setup();
    await inviteeSetup.renderNavigationAsync();
    const JoinProjectButton = await screen.findByText('Join a Project');
    expect(JoinProjectButton).toBeVisible();
    await user.press(JoinProjectButton);
    expect(
      await screen.findByText(
        'Coordinate with your team to receive a project invitation.',
      ),
    ).toBeVisible();

    await connectPeers([inviteeSetup.manager, invitorSetup.manager]);

    const invitorProject = await invitorSetup.client.getProject(
      invitorSetup.projectId,
    );

    await invitorProject.$setProjectSettings({name: 'testProject'});

    const inviteId = randomBytes(32);

    // Don't await — resolves only when invitee accepts/rejects, which happens via the UI being tested below.
    void invitorProject.$member.invite(inviteeSetup.manager.deviceId, {
      roleId: MEMBER_ROLE_ID,
      __testOnlyInviteId: inviteId,
    });

    expect(await screen.findByText("You've been invited to...")).toBeVisible();

    const joinButton = await screen.findByText('Join Project');
    expect(joinButton).toBeVisible();

    await user.press(joinButton);
    expect(
      await screen.findByText('You have joined testProject'),
    ).toBeVisible();
  });
});
