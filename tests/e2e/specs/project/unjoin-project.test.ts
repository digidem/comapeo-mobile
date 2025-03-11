import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId} from '../../utils/selectors';

describe('Unjoin Project', () => {
  it('should show message preventing rejoining project', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const createJoinOption = await $('~Go to Create or Join Project');
    await createJoinOption.click();

    await expect(
      $(byTextMatches('You are already on a project')),
    ).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Close Navigation Drawer').click();
  });
});
