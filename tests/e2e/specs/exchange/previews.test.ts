import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Settings for Previews', () => {
  it('should update to Previews Only and reflect it on main screen', async () => {
    await $(byTextMatches('Change Settings')).click();
    await expect($(byTextMatches('Exchange Previews Only'))).toBeDisplayed();

    await expect(
      $(byTextMatches('Reduced smaller size photos.')),
    ).toBeDisplayed();
    await expect($(byTextMatches('No audio included.'))).toBeDisplayed();
    const previewsOption = await $(byResourceId('EXCHANGE.option-previews'));
    await previewsOption.click();
    await expect(
      $(byResourceId('EXCHANGE.radio-selected-previews')),
    ).toBeDisplayed();
    const saveBtn = await $(byText('Save'));
    await saveBtn.click();

    await $(byTextMatches('Exchange previews only')).waitForDisplayed();

    const previewsTitle = await $(byTextMatches('Exchange previews only'));
    expect(await previewsTitle.isDisplayed()).toBe(true);
    await expect(
      $(byTextMatches('Reduced smaller size photos.')),
    ).toBeDisplayed();
    await expect($(byTextMatches('No audio included.'))).toBeDisplayed();
    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    await $('~Close Menu').click();
  });
});
