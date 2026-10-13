import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {handleGPSAlert} from '../../utils/alerts';

describe('Audio - Two Recordings Show in Thumbnails', () => {
  it('creates observation and records first audio', async () => {
    await $('~Add Observation').click();
    const community = await $(byTextMatches('Community'));
    await community.click();
    await $(byResourceId('OBS.add-audio-btn')).click();
    await driver.pause(3000);
    await $('~Stop recording audio.').click();

    await expect($(byTextMatches('Recording Saved!'))).toBeDisplayed();
    await expect($(byTextMatches('0[0-4]:[0-5][0-9]'))).toBeDisplayed();
    await $(byTextMatches('Done')).click();
  });

  it('confirms first audio thumbnail is correct', async () => {
    const firstThumb = await $('~Play audio recording.');
    await expect(firstThumb).toBeDisplayed();

    await expect($(byTextMatches('0[0-4]:[0-5][0-9]'))).toBeDisplayed();
    await expect($(byTextMatches('(ago|seconds|minutes)'))).toBeDisplayed();
  });

  it('records second audio and confirms both show up', async () => {
    await $(byResourceId('OBS.add-audio-btn')).click();
    await driver.pause(3000);
    await $('~Stop recording audio.').click();
    await $(byTextMatches('Done')).click();

    const thumbnails = await $$('~Play audio recording.');
    expect(thumbnails.length).toBeGreaterThanOrEqual(2);

    const durations = await $$(byTextMatches('0[0-4]:[0-5][0-9]'));
    expect(durations.length).toBeGreaterThanOrEqual(1);

    const times = await $$(byTextMatches('(ago|seconds|minutes)'));
    expect(times.length).toBeGreaterThanOrEqual(1);
  });
  it('saves edited observation (handles GPS alert)', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await handleGPSAlert();
  });
  it('confirms audio recordings appear in a saved observation', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await $(byTextMatches('Community')).click();
    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~Play audio recording.');
        const count = await thumbs.length;
        return count >= 2;
      },
      {
        timeout: 5000,
        timeoutMsg: 'Expected at least two audio thumbnails to appear',
      },
    );
    const thumbnails = await $$('~Play audio recording.');
    expect((await Promise.all(thumbnails)).length).toBeGreaterThanOrEqual(2);

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });
});
