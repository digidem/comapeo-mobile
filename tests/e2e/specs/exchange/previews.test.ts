import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Selecting Previews Only', () => {
  it('should verify that content related to previews type exchange is visible', async () => {
    await expect(
      $(byTextMatches('Exchange previews only')),
    ).not.toBeDisplayed();
    await $(byTextMatches('Change Settings')).click();

    const everythingPreviews = await $(
      byResourceId('EXCHANGE.option-previews'),
    );
    await everythingPreviews.click();
    await expect(
      $(byResourceId('EXCHANGE.radio-selected-previews')),
    ).toBeDisplayed();
    await $(byText('Save')).click();
    await expect($(byTextMatches('Exchange previews only'))).toBeDisplayed();
  });
});
