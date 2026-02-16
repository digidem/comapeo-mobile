import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {handleGPSAlert} from '../../utils/alerts';

describe('MAIN - Observation Navigation Flow', () => {
  it('should start on the Map screen if no observation exists', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });

  it('should navigate to PresetChooser when tapping Add Observation', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    await expect($(byTextMatches('Choose a category'))).toBeDisplayed();
  });

  it('should navigate to PresetChooser if an observation exists but no preset selected', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Choose a category'))).toBeDisplayed();
  });

  it('should navigate to ObservationCreate when a preset is selected', async () => {
    const animalCategory = await $(byTextMatches('Animal'));
    await animalCategory.click();

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
  });

  it('should retain ObservationCreate state when restarting the app', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('New Observation'))).toBeDisplayed();
  });

  it('should discard an observation and return to the map screen', async () => {
    const closeIcon = await $(byResourceId('close-icon'));
    await closeIcon.click();

    const discardObs = await $(byText('Discard Observation'));
    await discardObs.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });

  it('should create an observation, then edit, the reopen to edit screen when restarting app', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();
    const animalCategory = await $(byTextMatches('Animal'));
    await animalCategory.click();
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);
    await handleGPSAlert();
    const obervationsList = await $('~Go to observations list.');
    await obervationsList.click();

    const animalObs = await $(byTextMatches('Animal'));
    await animalObs.click();

    const editBtn = await $(byResourceId('editButton'));
    await editBtn.click();

    await expect($(byTextMatches('Edit Observation'))).toBeDisplayed();
    await expect($(byTextMatches('Change'))).toBeDisplayed();
    await expect($(byResourceId('OBS.description-inp'))).toBeDisplayed();

    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Edit Observation'))).toBeDisplayed();
  });
});
