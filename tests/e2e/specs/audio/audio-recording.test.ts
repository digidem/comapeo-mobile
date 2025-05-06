import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Audio - Recording Flow', () => {
  it('creates an observation and navigates to recording screen', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const airstripCategory = await $(byTextMatches('Airstrip'));
    await airstripCategory.click();

    const micButton = await $(byResourceId('OBS.add-audio-btn'));
    await micButton.click();

    const recordPrompt = await $(byTextMatches('Record up to 5 minutes'));
    await expect(recordPrompt).toBeDisplayed();

    const timer = await $(byTextMatches('00:00'));
    await expect(timer).toBeDisplayed();
  });

  it('starts recording and displays recording in-progress UI', async () => {
    const startButton = await $('~Start recording audio.');
    await startButton.click();

    const inProgressText = await $(byTextMatches('Less than 5 minutes left'));
    await expect(inProgressText).toBeDisplayed();
  });

  it('stops recording after 3 seconds and sees duration', async () => {
    const stopButton = await $('~Stop recording audio.');
    await stopButton.click();

    await expect(
      $(byTextMatches('Total length: 0[0-4]:[0-5][0-9]')),
    ).toBeDisplayed();
  });

  it('shows success modal after stopping recording', async () => {
    const audioEndButton = await $(byResourceId('close-icon'));
    await audioEndButton.click();

    await expect(
      $(byTextMatches('Your Audio Recording was added')),
    ).toBeDisplayed();

    await expect($(byTextMatches('Return to Editor'))).toBeDisplayed();
    await expect($(byTextMatches('Record Another'))).toBeDisplayed();
  });

  it('returns to editor and confirms audio attachment is visible', async () => {
    const editorReturn = await $(byTextMatches('Return to Editor'));
    await editorReturn.click();

    await expect($('~Play audio recording.')).toBeDisplayed();
    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
  });
});
