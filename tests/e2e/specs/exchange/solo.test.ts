import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Screen Solo Project', () => {
  it('should navigate to exchange screen and verify content for solo project', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const exchangeBtn = await $(byText('Exchange'));
    await exchangeBtn.click();

    const screenHeader = await $(byText('Exchange'));
    await expect(screenHeader).toBeDisplayed();

    await expect(
      $(byTextMatches('Securely share observations')),
    ).toBeDisplayed();
    await expect(
      $(byTextMatches('Get started in two simple ways')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Invite collaborators'))).toBeDisplayed();

    await expect($(byTextMatches('Join an existing project'))).toBeDisplayed();
    await expect($(byTextMatches('Your data stays secure'))).toBeDisplayed();
    await expect($(byTextMatches('Go Back'))).toBeDisplayed();

    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
