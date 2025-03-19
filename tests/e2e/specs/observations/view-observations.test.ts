import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('View Observations Flow', () => {
  it('should create observation with "Lake" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const lakeCategory = await $(byTextMatches('Lake'));
    await lakeCategory.click();

    await $(byTextMatches('UTM')).waitForExist({
      timeout: 10000,
      reverse: false,
    });

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();

    const noGpsSignal = await $(byTextMatches('No GPS signal'));
    if (await noGpsSignal.isDisplayed()) {
      console.info('GPS not found. Handling No GPS Signal prompt...');
      const confirmSave = await $(byTextMatches('SAVE'));
      await confirmSave.click();
    }
  });

  it('should create observation with "Clay" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const clayCategory = await $(byTextMatches('Clay'));
    await clayCategory.click();

    await $(byTextMatches('UTM')).waitForExist({
      timeout: 10000,
      reverse: false,
    });

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();

    const noGpsSignal = await $(byTextMatches('No GPS signal'));
    if (await noGpsSignal.isDisplayed()) {
      console.info('GPS not found. Handling No GPS Signal prompt...');
      const confirmSave = await $(byTextMatches('SAVE'));
      await confirmSave.click();
    }
  });

  it('should open Observations list and verify it is displayed', async () => {
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });

  it('should toggle camera tab and back to confirm correct place', async () => {
    const cameraTab = await $('~Go to Camera');
    await cameraTab.click();

    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();

    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });

  it('should confirm newly-created observations appear in the list', async () => {
    await expect($(byTextMatches('Lake'))).toBeDisplayed();
    await expect($(byTextMatches('Clay'))).toBeDisplayed();
    await expect($(byTextMatches('Gathering Site'))).toBeDisplayed();
    await expect($(byTextMatches('Threat'))).toBeDisplayed();

    await expect($(byResourceId('OBS.Clay-list-icon'))).toBeDisplayed();
    await expect(
      $(byResourceId('OBS.Gathering Site-list-icon')),
    ).toBeDisplayed();
    await expect($(byResourceId('OBS.Threat-list-icon'))).toBeDisplayed();
    await expect($(byResourceId('OBS.Lake-list-icon'))).toBeDisplayed();
  });

  it('should open "Clay" observation, check details, and go back to map', async () => {
    const clayItem = await $(byTextMatches('Clay'));
    await clayItem.click();

    await expect($(byTextMatches('Clay'))).toBeDisplayed();

    // Check date format: e.g. "Oct 25, 2024"
    const dateRegex =
      '^[A-Z][a-z]{2} (0?[1-9]|[12][0-9]|3[01]), (20[2-9][4-9]|2[1-9][0-9]{2})';
    await expect($(byTextMatches(dateRegex))).toBeDisplayed();

    await expect($(byResourceId('OBS.Clay-view-icon'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();

    await backBtn.click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
