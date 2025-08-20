import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {tapAboveElement} from '../../utils/touchActions';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Observations - Create Observation Flow', () => {
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

    expect(thumbnails.length).toBe(1);
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
    expect(thumbnails.length).toBe(2);
  });

  it('should open the photo modal when thumbnail clicked', async () => {
    const thumbnails = await $$('~View draft photo.');
    expect(thumbnails.length).toBe(2);
    await thumbnails[0].click();
    await expect($(byText('Photo Info'))).toBeDisplayed();
    await expect($(byText('Delete Photo'))).toBeDisplayed();
    await expect($(byText('Validated By CoMapeo'))).not.toBeDisplayed();
  });
});
