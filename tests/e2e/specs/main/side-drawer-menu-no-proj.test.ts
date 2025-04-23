import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Main - Side Drawer Menu - No Project', () => {
  it('should open the side drawer and verify menu options', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const editedDeviceName = await $(byText(output.names.editdevice));
    await expect(editedDeviceName).toBeDisplayed();

    await expect($(byTextMatches('CURRENT PROJECT'))).toBeDisplayed();

    await expect($(byResourceId('MENU.project-name'))).toHaveText(
      'My Solo Project',
    );
    await expect($(byResourceId('MENU.project-status'))).toHaveText(
      'You are mapping on your own.',
    );

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    const viewButton = await $(byText('View'));
    await expect(viewButton).toBeDisplayed();

    await expect($('~Go to Data and Privacy Screen')).toBeDisplayed();
    await expect($('~Go to Exchange Screen')).toBeDisplayed();
    await expect($('~Go to App Settings')).toBeDisplayed();
    await expect($('~Go to About CoMapeo Screen')).toBeDisplayed();

    await $('~Close Menu').click();
    const mapTab = await $('~Go to Map');
    await mapTab.click();
  });
});
