import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Team - Team Screen as Coordinator', () => {
  it('should navigate to team screen from project settings', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const viewSettings = await $('~Go to project settings screen.');
    await viewSettings.click();

    const screenHeader = await $(byText('Project Settings'));
    await expect(screenHeader).toBeDisplayed();

    const viewTeamButton = await $(byText('View Team'));
    await viewTeamButton.click();
  });

  it('should display Your Team header', async () => {
    const teamHeader = await $(byText('Your Team'));
    await expect(teamHeader).toBeDisplayed();
  });

  it('should display Invite Device button as coordinator', async () => {
    const inviteButton = await $(byResourceId('PROJECT.invite-device-btn'));
    await expect(inviteButton).toBeDisplayed();
  });

  it('should display Coordinators section with proper UI', async () => {
    const coordinatorsHeader = await $(byText('Coordinators'));
    await expect(coordinatorsHeader).toBeDisplayed();

    const coordinatorDescription = await $(
      byTextMatches(
        'Can invite devices, edit and delete data, and manage project details.',
      ),
    );
    await expect(coordinatorDescription).toBeDisplayed();
  });

  it('should display own device in coordinators list', async () => {
    const deviceName = await $(byTextMatches(output.names.device));
    await expect(deviceName).toBeDisplayed();
    const thisDeviceText = await $(byTextMatches('This Device'));
    await expect(thisDeviceText).toBeDisplayed();
  });

  it('should display Participants section', async () => {
    const participantsHeader = await $(byText('Participants'));
    await expect(participantsHeader).toBeDisplayed();

    const participantDescription = await $(
      byTextMatches(
        'Can take and share observations but not manage users or project details.',
      ),
    );
    await expect(participantDescription).toBeDisplayed();
  });

  it('should display Past Collaborators section', async () => {
    const pastCollaboratorsHeader = await $(byText('Past Collaborators'));
    await expect(pastCollaboratorsHeader).toBeDisplayed();

    const pastCollaboratorsDescription = await $(
      byTextMatches('Devices no longer contributing to this project.'),
    );
    await expect(pastCollaboratorsDescription).toBeDisplayed();
  });

  it('should navigate back to project settings', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const screenHeader = await $(byText('Project Settings'));
    await expect(screenHeader).toBeDisplayed();
  });
});
