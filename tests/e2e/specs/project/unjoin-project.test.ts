import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId} from '../../utils/selectors';

describe('Project - Unjoin Project', () => {
  it('should show message preventing rejoining project', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const createJoinOption = await $('~Go to Create or Join Project');
    await createJoinOption.click();

    await expect(
      $(byTextMatches('You are already on a project')),
    ).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Close Menu').click();
  });
});
