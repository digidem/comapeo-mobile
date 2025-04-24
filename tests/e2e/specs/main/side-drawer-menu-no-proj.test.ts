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

    await expect($(byTextMatches('My Solo Project'))).toBeDisplayed();

    await expect(
      $(byTextMatches('You are mapping on your own.')),
    ).toBeDisplayed();

    await expect($('~Go to All Projects Screen')).toBeDisplayed();

    await expect($('~Go to Data and Privacy Screen')).toBeDisplayed();
    await expect($('~Go to Exchange Screen')).toBeDisplayed();
    await expect($('~Go to App Settings')).toBeDisplayed();
    await expect($('~Go to About CoMapeo Screen')).toBeDisplayed();

    await drawerIcon.click();
  });
});
