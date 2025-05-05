import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Audio - Playback and Delete', () => {
  it('opens playback screen and verifies audio controls', async () => {
    const playBtn = await $('~Play Audio Recording');
    await playBtn.click();

    await expect($(byTextMatches('Total length:'))).toBeDisplayed();

    await expect($('~Delete Audio')).toBeDisplayed();
  });

  it('opens and cancels delete confirmation modal', async () => {
    const deleteBtn = await $('~Delete Audio');
    await deleteBtn.click();

    const confirmText = await $(
      byTextMatches('Your Audio Recording will be permanently deleted.'),
    );
    await expect(confirmText).toBeDisplayed();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();
  });

  it('confirms delete and verifies removal from observation', async () => {
    const deleteBtn = await $('~Delete Audio');
    await deleteBtn.click();

    const confirmDelete = await $(byText('Delete'));
    await confirmDelete.click();

    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
    await expect($('~Play Audio Recording')).not.toExist();
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
