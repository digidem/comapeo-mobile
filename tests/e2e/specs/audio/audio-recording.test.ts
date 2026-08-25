import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Audio - Recording Flow', () => {
  it('creates an observation and navigates to recording screen', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const caveCategory = await $(byTextMatches('Cave'));
    await caveCategory.click();

    const micButton = await $(byResourceId('OBS.add-audio-btn'));
    await micButton.click();
  });

  it('starts recording and displays recording in-progress UI', async () => {
    const inProgressText = await $(byTextMatches('Less than 5 minutes left'));
    await expect(inProgressText).toBeDisplayed();
  });

  it('stops recording after 3 seconds and sees duration', async () => {
    const stopButton = await $('~Stop recording audio.');
    await stopButton.click();
    await expect($(byText('Recording Saved!'))).toBeDisplayed();
    await expect($(byTextMatches('0[0-4]:[0-5][0-9]'))).toBeDisplayed();
    await expect($(byTextMatches('Done'))).toBeDisplayed();
    await expect($(byTextMatches('Delete'))).toBeDisplayed();
  });

  it('returns to editor and confirms audio attachment is visible', async () => {
    const editorReturn = await $(byTextMatches('Done'));
    await editorReturn.click();

    await expect($('~Play audio recording.')).toBeDisplayed();
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
  });
});
