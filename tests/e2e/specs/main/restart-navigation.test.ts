import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Observation Navigation Flow', () => {
  it('should start on the Map screen if no observation exists', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });

  it('should navigate to PresetChooser when tapping Add Observation', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    await expect($(byTextMatches('Choose what is happening'))).toBeDisplayed();
    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
  });

  it('should navigate to PresetChooser if an observation exists but no preset selected', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Choose what is happening'))).toBeDisplayed();
  });

  it('should navigate to ObservationCreate when a preset is selected', async () => {
    const houseCategory = await $(byTextMatches('House'));
    await houseCategory.click();

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

    const discardObs = await $(byTextMatches('Discard Observation'));
    await discardObs.click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
