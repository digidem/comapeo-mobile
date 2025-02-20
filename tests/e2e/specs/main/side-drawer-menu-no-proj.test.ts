import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Side Drawer Menu - No Project', () => {
  it('should open the side drawer and verify menu options', async () => {
    const drawerIcon = await $(byResourceId('drawer-icon-home'));
    await drawerIcon.click();

    const headerText = await $(
      byTextMatches('You are currently mapping on your own'),
    );
    await expect(headerText).toBeDisplayed();

    const createJoinOption = await $(
      byResourceId('MAIN.drawer-create-join-txt'),
    );
    await createJoinOption.click();
    await expect(headerText).toBeDisplayed();

    await expect($(byText('Create or Join Project'))).toBeDisplayed();
    await expect($(byText('Project Settings'))).toBeDisplayed();
    await expect($(byText('App Settings'))).toBeDisplayed();
    await expect($(byText('About CoMapeo'))).toBeDisplayed();

    await drawerIcon.click();
  });
});
