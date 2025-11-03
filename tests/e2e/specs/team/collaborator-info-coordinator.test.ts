import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Team - Collaborator Info as Coordinator', () => {
  it('should navigate to collaborator info screen and display own device details', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const viewSettings = await $('~Go to project settings screen.');
    await viewSettings.click();

    const viewTeamButton = await $(byText('View Team'));
    await viewTeamButton.click();

    const deviceName = await $(byTextMatches(output.names.device));
    await deviceName.click();

    // Verify header shows "This Device"
    const thisDeviceHeader = await $(byText('This Device'));
    await expect(thisDeviceHeader).toBeDisplayed();

    // Verify device name is displayed
    await expect($(byTextMatches(output.names.device))).toBeDisplayed();

    // Verify Coordinator role is shown
    const coordinatorRole = await $(byText('Coordinator'));
    await expect(coordinatorRole).toBeDisplayed();

    // Verify "Added on" date is visible
    const addedOnText = await $(byTextMatches('Added on'));
    await expect(addedOnText).toBeDisplayed();
  });

  it('should not display Leave Project or Remove Device buttons', async () => {
    // As a coordinator viewing own device, there should be no action buttons
    // Coordinators cannot leave projects yet, and users cannot remove own device
    const leaveProjectButton = await $(byText('Leave Project'));
    await expect(leaveProjectButton).not.toBeDisplayed();

    const removeDeviceButton = await $(byText('Remove Device'));
    await expect(removeDeviceButton).not.toBeDisplayed();
  });

  it('should navigate back to map screen', async () => {
    // Back to team screen
    let backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await expect($(byText('Your Team'))).toBeDisplayed();

    // Back to project settings
    backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await expect($(byText('Project Settings'))).toBeDisplayed();

    // Back to drawer, then to map
    backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
