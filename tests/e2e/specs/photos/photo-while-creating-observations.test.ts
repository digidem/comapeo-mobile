import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';

describe('Photos - Save and Delete Photo', () => {
  it('should create a new observation', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
    await expect($(byResourceId('OBS.House-icon'))).toBeDisplayed();
    await expect(houseCategory).toBeDisplayed();
  });

  it('should take a picture and show it as a thumbnail', async () => {
    const addPhotoBtn = await $(byResourceId('OBS.add-photo-btn'));
    await addPhotoBtn.click();
    await expect($(byResourceId('MAIN.camera-scrn'))).toBeDisplayed();
    const takePhotoBtn = await $(byResourceId('addButtonCamera'));
    ('addButtonCamera');

    await takePhotoBtn.click();

    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~View draft photo.');
        const count = await thumbs.length;
        return count === 1;
      },
      {
        timeout: 5000,
      },
    );

    const thumbnails = await $$('~View draft photo.');

    await expect(thumbnails.length).toBe(1);
  });

  it('should take another photo and show 2 thumbnails', async () => {
    const addPhotoBtn = await $(byResourceId('OBS.add-photo-btn'));
    await addPhotoBtn.click();
    await expect($(byResourceId('MAIN.camera-scrn'))).toBeDisplayed();
    const takePhotoBtn = await $(byResourceId('addButtonCamera'));
    await takePhotoBtn.click();

    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~View draft photo.');
        const count = await thumbs.length;
        return count === 2;
      },
      {
        timeout: 5000,
      },
    );

    const thumbnails = await $$('~View draft photo.');
    await expect(thumbnails.length).toBe(2);
  });

  it('should open the photo modal when thumbnail clicked', async () => {
    const thumbnails = await $$('~View draft photo.');
    await expect(thumbnails.length).toBe(2);
    await thumbnails[0].click();
    await expect($(byText('Photo Info'))).toBeDisplayed();
    await expect($(byText('Delete Photo'))).toBeDisplayed();
    await expect($(byText('Validated By CoMapeo'))).not.toBeDisplayed();
  });

  it('should delete photo', async () => {
    const deleteBtn = await $(byTextMatches('Delete Photo'));
    await deleteBtn.click();

    await expect(await $(byTextMatches('Delete this photo?'))).toBeDisplayed();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();
    await driver.pause(1000);

    await deleteBtn.click();

    const deletePhotoBtn = await $(byResourceId('PHOTO.deletePhoto'));
    await deletePhotoBtn.click();

    await browser.waitUntil(
      async () => {
        const thumbs = await $$('~View draft photo.');
        const count = await thumbs.length;
        return count === 1;
      },
      {
        timeout: 5000,
      },
    );

    const thumbnails = await $$('~View draft photo.');
    await expect(thumbnails.length).toBe(1);
  });

  it('should save observation with photo', async () => {
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);
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
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    const houseObservation = await $(byTextMatches('House'));
    await expect(houseObservation).toBeDisplayed();
  });
});
