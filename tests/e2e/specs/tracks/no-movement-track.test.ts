import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Tracks - No movement flow', () => {
  it('opens discard modal and chooses to continue editing', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();

    const stopTracksBtn = await $(byTextMatches('Stop Tracks'));
    await stopTracksBtn.waitForClickable({timeout: 10000});
    await stopTracksBtn.click();

    await expect($(byTextMatches('No Track Recorded'))).toBeDisplayed();
    await expect(
      $(byTextMatches("You didn't move beyond one meter.")),
    ).toBeDisplayed();

    const continueBtn = await $(byTextMatches('Continue Recording'));
    await continueBtn.waitForClickable({timeout: 10000});
    await continueBtn.click();

    const stopTracksBtn2 = await $(byTextMatches('Stop Tracks'));
    await stopTracksBtn2.waitForClickable({timeout: 10000});
    await stopTracksBtn2.click();

    const exitButton = await $(byTextMatches('Exit Tracks'));
    await exitButton.waitForClickable({timeout: 10000});
    await exitButton.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
