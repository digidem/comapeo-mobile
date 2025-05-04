import {expect} from '@wdio/globals';
import {describe, it, before} from 'mocha';
import {byTextMatches} from '../../utils/selectors';

describe('Tracks - Start Track Flow (Permissions Pre-Granted)', () => {
  before(async () => {
    const mapTab = await $('~Go to Map');
    await mapTab.click();
  });

  it('opens the track bottom sheet and starts tracking', async () => {
    const trackBtn = await $('~Go to Tracking');
    await trackBtn.click();

    const startBtn = await $(byTextMatches('Start Tracks'));
    await expect(startBtn).toBeDisplayed();

    await startBtn.click();

    await expect($(byTextMatches('Stop Tracks'))).toBeDisplayed();
    await expect($(byTextMatches('You’ve been recording for'))).toBeDisplayed();
  });
});
