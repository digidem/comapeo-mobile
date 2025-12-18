import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Tracks - No movement flow', () => {
  it('opens discard modal and chooses to continue editing', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();
    await $(byTextMatches('Stop Tracks')).click();
    await expect($(byTextMatches('No Track Recorded'))).toBeDisplayed();
    await expect(
      $(byTextMatches("You didn't move beyond one meter.")),
    ).toBeDisplayed();
    const continueBtn = await $(byTextMatches('Continue Recording'));
    await continueBtn.click();
    await driver.pause(1000);
    await $(byTextMatches('Stop Tracks')).click();
    const exitButton = await $(byTextMatches('Exit Tracks'));
    await exitButton.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
