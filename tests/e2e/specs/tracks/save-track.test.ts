import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Tracks - Post-Observation Track Saving Flow', () => {
  it('opens discard modal and chooses to continue editing', async () => {
    const trackBtn = await $('~Go to tracking.');
    await trackBtn.click();
    await $(byTextMatches('Stop Tracks')).click();
    const discardBtn = $(byResourceId('close-icon'));
    await discardBtn.click();

    await expect($(byTextMatches('Discard Track'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Your Track will not be saved')),
    ).toBeDisplayed();

    const continueBtn = await $(byTextMatches('Continue editing'));
    await continueBtn.click();

    await expect($(byTextMatches('New Track'))).toBeDisplayed();
  });
  it('enters description and saves the track', async () => {
    const notesInput = await $(byResourceId('trackDescriptionField'));
    await notesInput.setValue('This is a test track description');

    const saveBtn = await $('~Save track.');
    await saveBtn.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
