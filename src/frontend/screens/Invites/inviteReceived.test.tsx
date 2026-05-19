import {screen, userEvent, act} from '@testing-library/react-native';
import {setupIntegrationTest} from '../../../../tests/integration/helpers/setupIntegrationTest';
import {randomBytes} from 'node:crypto';
import {MEMBER_ROLE_ID} from '../../sharedTypes';
import {connectPeers} from '../../../../tests/integration/helpers/core';

describe('Invite received test', () => {
  const inviteeSetup = setupIntegrationTest();
  const invitorSetup = setupIntegrationTest();

  test('opens invite received bottom sheet on invitee device', async () => {
    const user = userEvent.setup();
    inviteeSetup.renderNavigation({
      activeProjectId: inviteeSetup.projectId,
    });

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

    await act(async () => {
      await user.press(joinButton);
      expect(
        await screen.findByText('You have joined testProject'),
      ).toBeVisible();
    });
  });
});
