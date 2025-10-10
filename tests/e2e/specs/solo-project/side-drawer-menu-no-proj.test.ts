import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Main - Side Drawer Menu - No Project', () => {
  it('should open the side drawer and verify menu options', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    await expect($(byTextMatches('CURRENT PROJECT'))).toBeDisplayed();

    await expect($(byTextMatches(output.names.device))).toBeDisplayed();

    await expect(
      $(byTextMatches('You are mapping on your own.')),
    ).toBeDisplayed();

    await expect($('~Go to All Projects Screen')).toBeDisplayed();

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    const viewButton = await $(byText('View'));
    await expect(viewButton).toBeDisplayed();

    await expect($('~Go to data and privacy screen.')).toBeDisplayed();
    await expect($('~Go to exchange screen.')).toBeDisplayed();
    await expect($('~Go to app settings screen.')).toBeDisplayed();
    await expect($('~Go to about CoMapeo screen.')).toBeDisplayed();

    await $('~Close Menu').click();
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });
});
