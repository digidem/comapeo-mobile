import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Exchange - Exchange Settings for Previews', () => {
  it('should verify that content related to previews type exchange is visible', async () => {
    await expect($(byTextMatches('Exchange previews only'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Reduced smaller size photos.')),
    ).toBeDisplayed();
    await expect($(byTextMatches('No audio included.'))).toBeDisplayed();
    await $(byTextMatches('Change Settings')).click();
    await $(byResourceId('EXCHANGE.option-previews')).waitForDisplayed();
    await expect(
      $(byResourceId('EXCHANGE.radio-selected-previews')),
    ).toBeDisplayed();
    await $(byText('Close')).click();
    await expect($(byTextMatches('Exchange previews only'))).toBeDisplayed();
  });
});
