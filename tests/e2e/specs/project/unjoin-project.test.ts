import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';

describe('Unjoin Project', () => {
  it('should show message preventing rejoining project', async () => {
    const drawerIcon = await $(byResourceId('drawer-icon-home'));
    await drawerIcon.click();

    const createJoinOption = await $(
      byResourceId('MAIN.create-join-list-item'),
    );
    await createJoinOption.click();

    await expect($(byText('You are already on a project'))).toBeDisplayed();
  });
});
