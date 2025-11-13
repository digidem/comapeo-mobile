import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {getDeviceTimezone, getLongFormattedDate} from '../../utils/date';

let deviceTimezone: string;

describe('Team - Collaborator Info as Coordinator', () => {
  before(async () => {
    deviceTimezone = await getDeviceTimezone();
  });
  it('should navigate to collaborator info screen and display own device details', async () => {
    const teamSettings = await $('~Go to your team screen.');
    await teamSettings.click();
    const deviceName = await $(byTextMatches(output.names.device));
    await deviceName.click();
    const thisDeviceHeader = await $(byText('This Device'));
    await expect(thisDeviceHeader).toBeDisplayed();
    await expect($(byTextMatches(output.names.device))).toBeDisplayed();
    const coordinatorRole = await $(byText('Coordinator'));
    await expect(coordinatorRole).toBeDisplayed();
    const addedOnText = await $(byTextMatches('Added on'));
    await expect(addedOnText).toBeDisplayed();

    const today = getLongFormattedDate(deviceTimezone);
    await expect($(byTextMatches(today))).toBeDisplayed();
  });

  it('should not display Leave Project or Remove Device buttons', async () => {
    const leaveProjectButton = await $(byText('Leave Project'));
    await expect(leaveProjectButton).not.toBeDisplayed();

    const removeDeviceButton = await $(byText('Remove Device'));
    await expect(removeDeviceButton).not.toBeDisplayed();
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
