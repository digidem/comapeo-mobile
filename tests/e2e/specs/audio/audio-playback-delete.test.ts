import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Audio - Playback and Delete', () => {
  it('opens playback screen and verifies display', async () => {
    const thumbnail = await $('~Play audio recording.');
    await thumbnail.click();

    checkForElementGone(byTextMatches('Recording Saved!'));
    await expect($(byTextMatches('\\d+:\\d{2}'))).toBeDisplayed();
    await expect($(byText('Delete'))).toBeDisplayed();
    await expect($(byText('Back to Editing'))).toBeDisplayed();
  });

  it('deletes audio and verifies removal from observation', async () => {
    const deleteBtn = await $(byText('Delete'));
    await deleteBtn.click();

    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
    await checkForElementGone('~Play audio recording.');
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
