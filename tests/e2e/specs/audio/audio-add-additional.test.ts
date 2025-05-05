import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Audio - Add Additional Recording', () => {
  it('creates observation and records first audio clip', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const communityCategory = await $(byTextMatches('Community'));
    await communityCategory.click();
    await expect($(byTextMatches('Community'))).toBeDisplayed();

    const micButton = await $(byResourceId('OBS.add-audio-btn'));
    await micButton.click();

    const startButton = await $('~Start Recording Audio');
    await startButton.click();
    await browser.pause(2000);
    const stopButton = await $('~Stop Recording Audio');
    await stopButton.click();

    const closeBtn = await $(byResourceId('close-icon'));
    await closeBtn.click();

    await expect(
      $(byTextMatches('Your Audio Recording was added')),
    ).toBeDisplayed();
  });

  it('taps "Record Another" and starts second recording', async () => {
    const another = await $(byTextMatches('Record Another'));
    await another.click();

    const recordPrompt = await $(byTextMatches('Record up to 5 minutes'));
    await expect(recordPrompt).toBeDisplayed();

    const timer = await $(byTextMatches('00:00'));
    await expect(timer).toBeDisplayed();

    const startButton = await $('~Start Recording Audio');
    await startButton.click();

    const inProgressText = await $(byTextMatches('Less than 5 minutes left'));
    await expect(inProgressText).toBeDisplayed();
  });

  it('stops second recording and returns to editor', async () => {
    const stopButton = await $('~Stop Recording Audio');
    await browser.pause(3000);
    await stopButton.click();

    await expect($(byTextMatches('Total length: 00:03'))).toBeDisplayed();

    const audioEndButton = await $(byResourceId('close-icon'));
    await audioEndButton.click();

    await expect(
      $(byTextMatches('Your Audio Recording was added')),
    ).toBeDisplayed();

    const returnBtn = await $(byTextMatches('Return to Editor'));
    await returnBtn.click();
  });

  it('verifies that both audio thumbnails are visible and exits', async () => {
    const audioThumbnails = await $$('~Play Audio Recording');
    expect(audioThumbnails.length).toBeGreaterThanOrEqual(2);
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
});
