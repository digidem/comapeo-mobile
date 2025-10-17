import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';

describe('Menu - should show different UI when on default (solo) project', () => {
  it('should show default info at top of menu', async () => {
    // this is currently not the header, but it will be changed in a subsequent PR
    const header = await $('~Open Menu');
    await header.click();

    await expect(await $(byText('Just You'))).toBeDisplayed();
    await expect(
      await $(byText("You're mapping on your own.")),
    ).toBeDisplayed();
  });

  it('should show collaborate button', async () => {
    const mainActionButton = await $(byResourceId('MENU.main-action-button'));

    await expect(mainActionButton).toBeDisplayed();

    await expect(await $(byText('Collaborate'))).toBeDisplayed();

    await expect(await $(byText('Exchange'))).not.toBeDisplayed();
  });

  it('should not show "team" button nor "coordinator tools" button ', async () => {
    await expect(await $(byText('Team'))).not.toBeDisplayed();
    await expect(await $(byText('Coordinator Tools'))).not.toBeDisplayed();
  });
});
