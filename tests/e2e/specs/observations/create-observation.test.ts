import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {tapAboveElement} from '../../utils/touchActions';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Observations - Create Observation Flow', () => {
  // it('should set location and open create observation screen', async () => {
  //   const addObsBtn = await $('~Add Observation');
  //   await addObsBtn.click();
  //   await expect($(byTextMatches('Choose a category'))).toBeDisplayed();
  //   await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
  // });

  // it('should discard observation and return to the map screen', async () => {
  //   const closeIcon = await $(byResourceId('close-icon'));
  //   await closeIcon.click();

  //   const discardObs = await $(byText('Discard Observation'));
  //   await expect(discardObs).toBeDisplayed();

  //   const continueEditing = await $(byTextMatches('Continue editing'));
  //   await continueEditing.click();
  //   checkForElementGone(byTextMatches('Continue editing'));

  //   await closeIcon.click();
  //   await discardObs.click();

  //   await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  // });

  it('should pick House category and display New Observation screen', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
    await expect($(byResourceId('close-icon'))).toBeDisplayed();
    await expect($(byResourceId('OBS.edit-save-btn'))).toBeDisplayed();
    await expect($(byTextMatches('Change'))).toBeDisplayed();
    await expect($(byResourceId('OBS.add-photo-btn'))).toBeDisplayed();
    await expect($(byResourceId('OBS.add-details-btn'))).toBeDisplayed();
    await expect($(byTextMatches('What is happening here?'))).toBeDisplayed();

    try {
      await expect(
        $(byTextMatches('^UTM\\s\\w+\\s\\d+\\s\\d+$')),
      ).toBeDisplayed();
    } catch (e) {
      await expect($(byTextMatches('Searching'))).toBeDisplayed();
    }

    await expect($(byResourceId('OBS.House-icon'))).toBeDisplayed();
    await expect(houseCategory).toBeDisplayed();
  });

  // it('should change category to Threat and add a description', async () => {
  //   const changeBtn = await $(byTextMatches('Change'));
  //   await changeBtn.click();
  //   await expect($(byResourceId('MAIN.categories-scrn'))).toBeDisplayed();

  //   const threatOption = await $(byTextMatches('Threat'));
  //   await threatOption.scrollIntoView();
  //   await threatOption.click();

  //   const descriptionInput = await $(byResourceId('OBS.description-inp'));
  //   await descriptionInput.click();
  //   await descriptionInput.setValue('Sample description');

  //   await expect($(byResourceId('OBS.add-photo-btn-keyboard'))).toBeDisplayed();

  //   const showOptionsElem = $(byTextMatches('Show Options'));
  //   await tapAboveElement(showOptionsElem, 150);
  //   checkForElementGone(byTextMatches('Show Options'));
  // });

  it('should take a photo', async () => {
    const addPhotoBtn = await $(byResourceId('OBS.add-photo-btn'));
    await addPhotoBtn.click();
    await expect($(byResourceId('MAIN.camera-scrn'))).toBeDisplayed();

    const takePhotoButton = await $(byResourceId('addButtonCamera'));

    await takePhotoButton.click();

    const thumbnails = await $$('~View draft photo.');

    expect(thumbnails).toHaveLength(1);
  });

  it('should open camera, cancel, then save observation', async () => {
    const addPhotoBtn = await $(byResourceId('OBS.add-photo-btn'));
    await addPhotoBtn.click();
    await expect($(byResourceId('MAIN.camera-scrn'))).toBeDisplayed();

    const cancelCamera = await $(byTextMatches('Cancel'));
    await cancelCamera.click();
    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
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
    const mapBtn = await $('~Go to map.');
    await mapBtn.click();
  });
});
