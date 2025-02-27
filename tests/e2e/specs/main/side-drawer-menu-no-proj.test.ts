import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches} from '../../utils/selectors';

describe('Side Drawer Menu - No Project', () => {
  it('should open the side drawer and verify menu options', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const headerText = await $(
      byTextMatches('You are currently mapping on your own'),
    );
    await expect(headerText).toBeDisplayed();

    const createJoinOption = await $('~You are currently mapping on your own');
    await createJoinOption.click();
    await expect(headerText).toBeDisplayed();

    await expect($('~Go to Create or Join Project')).toBeDisplayed();
    await expect($('~Go to Project Settings')).toBeDisplayed();
    await expect($('~Go to App Settings')).toBeDisplayed();
    await expect($('~Go to About CoMapeo Screen')).toBeDisplayed();

    await drawerIcon.click();
  });
});
