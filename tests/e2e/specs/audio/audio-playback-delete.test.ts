import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {checkForElementGone} from '../../utils/checkForGone';
import {handleGPSAlert} from '../../utils/alerts';

describe('Audio - Playback and Delete', () => {
  it('opens playback screen and verifies display', async () => {
    const thumbnail = await $('~Play audio recording.');
    await thumbnail.click();

    checkForElementGone(byTextMatches('Recording Saved!'));
    await expect($(byTextMatches('\\d+:\\d{2}'))).toBeDisplayed();
    await expect($(byText('Delete'))).toBeDisplayed();
    await expect($(byText('Done'))).toBeDisplayed();
  });

  it('deletes audio and verifies removal from observation', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await checkForElementGone('~Play audio recording.');
  });

  it('saves edited observation (handles GPS alert)', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await handleGPSAlert();
  });
});
