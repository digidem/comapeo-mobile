import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Audio - Two Recordings Show in Thumbnails', () => {
  it('creates observation and records first audio', async () => {
    await $('~Add Observation').click();
    await $(byTextMatches('Community')).click();
    await $(byResourceId('OBS.add-audio-btn')).click();
    await driver.pause(3000);
    await $('~Stop recording audio.').click();

    await expect($(byTextMatches('Recording Saved!'))).toBeDisplayed();
    await expect($(byTextMatches('0[0-4]:[0-5][0-9]'))).toBeDisplayed();
    await $(byTextMatches('Back to Editing')).click();
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
    await $(byTextMatches('Back to Editing')).click();

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

    try {
      const text = await driver.getAlertText();
      if (text.includes('No GPS signal') || text.includes('Weak GPS signal')) {
        await driver.execute('mobile: acceptAlert', {
          buttonLabel: 'SAVE',
        });
      }
    } catch (err) {
      console.log('No RN Alert dialog was found.');
    }
  });
  it('confirms audio recordings can be played from a saved observation', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await $(byTextMatches('Community')).click();
    const thumbnails = await $$('~Play audio recording.');
    thumbnails[0].click();
    await expect(
      $(byTextMatches('(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)')),
    ).toBeDisplayed();
    await expect($(byTextMatches('Share'))).toBeDisplayed();
    const initialTimer = await $(byTextMatches('00:00 / \\d{2}:\\d{2}'));
    await expect(initialTimer).toBeDisplayed();
    const playBtn = $(byResourceId('audio-play-toggle'));
    playBtn.click();

    await driver.pause(1500);

    await expect(
      $(byTextMatches('0[1-9]:\\d{2} / \\d{2}:\\d{2}')),
    ).toBeDisplayed();

    playBtn.click();

    await driver.back();
    await driver.back();
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });
});
