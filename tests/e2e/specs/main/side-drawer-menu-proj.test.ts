import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Main - Side Drawer Menu - Project Joined', () => {
  it('should display the project name in the side drawer', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    await expect($(byText(`${output.names.project}`))).toBeDisplayed();
    await expect(
      $(byText('You are a coordinator on this project.')),
    ).toBeDisplayed();

    const inviteButton = await $(byText('Invite'));
    await expect(inviteButton).toBeDisplayed();
    const viewButton = await $(byText('View'));
    await expect(viewButton).toBeDisplayed();

    inviteButton.click();
    await expect($(byTextMatches('Select Device to Invite'))).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    await $('~Close Menu').click();
  });
});
