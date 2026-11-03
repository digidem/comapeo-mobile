import {expect} from '@wdio/globals';
import {describe, it, before} from 'mocha';
import {byResourceId} from '../../utils/selectors';

describe('Tracks - Start Track Flow (Permissions Pre-Granted)', () => {
  before(async () => {
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });

  it('opens the track bottom sheet and starts tracking', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();

    const startBtn = await $(byResourceId('TRACK.start-btn'));
    await expect(startBtn).toBeDisplayed();

    await startBtn.click();

    await expect($(byResourceId('TRACK.end-btn'))).toBeDisplayed();
  });
});
