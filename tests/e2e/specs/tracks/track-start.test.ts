import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches} from '../../utils/selectors';

describe('Tracks - Start Track Flow (Permissions Pre-Granted)', () => {
  it('should open bottom sheet and start tracking', async () => {
    const mapTab = await $('~Go to Map');
    await mapTab.click();

    const trackBtn = await $('~Go to Tracking');
    await trackBtn.click();

    await expect($(byTextMatches('Start Tracks'))).toBeDisplayed();

    const startBtn = await $(byTextMatches('Start Tracks'));
    await startBtn.click();

    await expect($(byTextMatches('Stop Tracks'))).toBeDisplayed();
    await expect($(byTextMatches('You’ve been recording for'))).toBeDisplayed();
  });
});
