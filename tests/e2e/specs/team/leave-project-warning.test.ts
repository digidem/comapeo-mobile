import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byResourceId, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Team - Leave Project Warning Screen', () => {
  it('should show warning screen when last coordinator or device tries to leave', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const teamSettings = await $('~Go to your team screen.');
    await teamSettings.click();

    const deviceName = await $(byTextMatches(output.names.device));
    await deviceName.click();

    const leaveProjectButton = await $(byText('Leave Project'));
    await leaveProjectButton.click();

    const warningTitle = await $(byTextMatches('Device is last device.'));
    await expect(warningTitle).toBeDisplayed();

    const warningDescription = await $(
      byTextMatches(
        'If this device leaves, then all data on this project will be lost.',
      ),
    );
    await expect(warningDescription).toBeDisplayed();

    const exportText = await $(
      byTextMatches('Before leaving, export any important data.'),
    );
    await expect(exportText).toBeDisplayed();

    const continueButton = await $(byText('Continue'));
    await expect(continueButton).toBeDisplayed();

    const cancelButton = await $(byText('Cancel'));
    await expect(cancelButton).toBeDisplayed();
    await cancelButton.click();

    const thisDeviceHeader = await $(byText('This Device'));
    await expect(thisDeviceHeader).toBeDisplayed();
  });

  it('should navigate to Leave Project confirmation when Continue is pressed', async () => {
    const leaveProjectButton = await $(byText('Leave Project'));
    await leaveProjectButton.click();

    const continueButton = await $(byText('Continue'));
    await expect(continueButton).toBeDisplayed();
    await continueButton.click();

    const leaveConfirmationDescription = await $(
      byTextMatches(
        'Device will no longer be able to view, contribute to, or administer this project.',
      ),
    );
    await expect(leaveConfirmationDescription).toBeDisplayed();

    const leaveConfirmationButtonText = await $(byText('Yes, Leave'));
    await expect(leaveConfirmationButtonText).toBeDisplayed();

    let cancelButton = await $(byText('Cancel'));
    await cancelButton.click();

    await expect($(byTextMatches('Device is last device'))).toBeDisplayed();

    cancelButton = await $(byText('Cancel'));
    await cancelButton.click();

    await expect($(byText('This Device'))).toBeDisplayed();
  });

  it('should navigate back to map screen', async () => {
    let backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await expect($(byText('Team'))).toBeDisplayed();
    backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
