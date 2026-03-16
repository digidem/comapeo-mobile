import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Settings for Everything', () => {
  it('should have exchange everything set to defaul', async () => {
    await expect($(byTextMatches('Exchange Everything'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Full size photos and audio')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Uses more storage'))).toBeDisplayed();
  });

  it('should have exchange everything selected', async () => {
    const changeSettingsBtn = await $(byTextMatches('Change Settings'));
    await changeSettingsBtn.click();
    await expect(
      $(byResourceId('EXCHANGE.radio-selected-everything')),
    ).toBeDisplayed();
    await $(byText('Close')).click();
    // const saveBtn = await $(byText('Save'));
    // await saveBtn.click();

    // await $(byTextMatches('Exchange everything')).waitForDisplayed();

    // const everythingTitle = await $(byTextMatches('Exchange everything'));
    // expect(await everythingTitle.isDisplayed()).toBe(true);
    // await expect(
    //   $(byTextMatches('Full size photos and audio')),
    // ).toBeDisplayed();
    // await expect($(byTextMatches('Uses more storage'))).toBeDisplayed();
    // await $(byResourceId('MAIN.header-back-btn')).click();
    // await $(byResourceId('MAIN.map-screen')).click();
  });
});
