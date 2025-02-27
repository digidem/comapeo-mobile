import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {tapAboveElement} from '../../utils/touchActions';

describe('Create Observation Flow', () => {
  it('should set location and open add-observation screen', async () => {
    const addObsBtn = await $(byResourceId('MAIN.add-observation-btn'));
    await addObsBtn.click();
    await expect($(byTextMatches('Choose what is happening'))).toBeDisplayed();
    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
  });

  it('should discard observation and return to the map screen', async () => {
    const closeIcon = await $(byResourceId('close-icon'));
    await closeIcon.click();

    const discardObs = await $(byTextMatches('Discard Observation'));
    await expect(discardObs).toBeDisplayed();

    const continueEditing = await $(byTextMatches('Continue editing'));
    await continueEditing.click();
    await discardObs.waitForDisplayed({
      reverse: true,
      timeout: 1500,
    });

    await closeIcon.click();
    await discardObs.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });

  it('should pick House category and display New Observation screen', async () => {
    const addObsBtn = await $(byResourceId('MAIN.add-observation-btn'));
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

    await expect($(byTextMatches('UTM 44N 218632 21930'))).toBeDisplayed();

    await expect($(byResourceId('OBS.House-icon'))).toBeDisplayed();
    await expect($(byTextMatches('House'))).toBeDisplayed();
  });

  it('should change category to Threat and add a description', async () => {
    const changeBtn = await $(byTextMatches('Change'));
    await changeBtn.click();
    await expect($(byResourceId('MAIN.categories-scrn'))).toBeDisplayed();

    const threatOption = await $(byTextMatches('Threat'));
    await threatOption.scrollIntoView();
    await threatOption.click();

    const descriptionInput = await $(byResourceId('OBS.description-inp'));
    await descriptionInput.click();
    await descriptionInput.setValue('Sample description');

    await expect($(byResourceId('OBS.add-photo-btn-keyboard'))).toBeDisplayed();

    const showOptionsElem = $(byTextMatches('Show Options'));
    await tapAboveElement(showOptionsElem, 150);
    await $(byResourceId('OBS.add-photo-btn-keyboard')).waitForDisplayed({
      reverse: true,
      timeout: 1500,
    });
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

    try {
      const backBtn = await $(byResourceId('MAIN.header-back-btn'));
      if (await backBtn.isDisplayed()) {
        await backBtn.click();
      }
    } catch (e) {
      console.info('Back button not visible, continuing...');
    }
  });
});
