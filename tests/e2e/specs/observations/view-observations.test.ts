import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Observations - View Observations Flow', () => {
  it('should create observation with "Lake" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const lakeCategory = await $(byTextMatches('Lake'));
    await lakeCategory.click();

    try {
      await $(byTextMatches('UTM')).waitForExist({
        timeout: 10000,
        reverse: false,
      });
    } catch (e) {
      await expect($(byTextMatches('Searching'))).toBeDisplayed();
    }

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

  it('should create observation with "Clay" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const clayCategory = await $(byTextMatches('Clay'));
    await clayCategory.click();
    try {
      await $(byTextMatches('UTM')).waitForExist({
        timeout: 10000,
        reverse: false,
      });
    } catch (e) {
      await expect($(byTextMatches('Searching'))).toBeDisplayed();
    }
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

  it('should open Observations list and verify it is displayed', async () => {
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });

  it('should display my role in the observations list', async () => {
    const myRoleText = await $(byResourceId('OBS.card-text'));
    await expect(myRoleText).toBeDisplayed();
    await expect(myRoleText).toHaveText(
      'You’re a coordinator on this project.',
    );
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
    const mapTab = await $('~Go to Map');
    await mapTab.click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
