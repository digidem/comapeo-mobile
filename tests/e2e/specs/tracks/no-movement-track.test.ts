import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Tracks - No movement flow', () => {
  it('opens discard modal and chooses to continue editing', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();
    await $(byResourceId('TRACK.end-btn')).click();
    await expect($(byTextMatches('No Track Recorded'))).toBeDisplayed();
    await expect($(byTextMatches("This device didn't move."))).toBeDisplayed();
    const continueBtn = await $(byTextMatches('Keep Recording'));
    await continueBtn.click();
    await driver.pause(1000);
    await $(byResourceId('TRACK.end-btn')).click();
    const exitButton = await $(byTextMatches('Discard'));
    await exitButton.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
