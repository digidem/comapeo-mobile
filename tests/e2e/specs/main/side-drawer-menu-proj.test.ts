import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Side Drawer Menu - Project Joined', () => {
  it('should display the project name in the side drawer', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    await expect($(byText(`Project ${output.names.project}`))).toBeDisplayed();

    await $('~Close Navigation Drawer').click();
  });
});
