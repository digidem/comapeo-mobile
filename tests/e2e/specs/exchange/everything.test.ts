import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Settings for Everything', () => {
  it('should verify that content related to everything exchange is visible', async () => {
    await expect($(byTextMatches('Exchange everything'))).toBeDisplayed();

    await expect(
      $(byTextMatches('Full size photos and audio')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Uses more storage'))).toBeDisplayed();
    const changeSettingsBtn = await $(byTextMatches('Change Settings'));
    await changeSettingsBtn.click();
    await $(byResourceId('EXCHANGE.option-everything')).waitForDisplayed();
    const selectedEverythingRadio = await $$(
      'android=new UiSelector().className("android.view.View").descriptionContains("Exchange Everything")',
    );
    expect(selectedEverythingRadio.length).toBeGreaterThan(0);
    await $(byText('Close')).click();
    await expect($(byTextMatches('Exchange everything'))).toBeDisplayed();
  });
});
