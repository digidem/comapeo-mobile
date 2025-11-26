import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {handleGPSAlert} from '../../utils/alerts';

describe('Observations - View Observations Flow', () => {
  it('should create observation with "Cave" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const caveCategory = await $(byTextMatches('Cave'));
    await caveCategory.click();

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
    await handleGPSAlert();
  });

  it('should create observation with "Tree" category', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const treeCategory = await $(byTextMatches('Tree'));
    await treeCategory.click();
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
    await handleGPSAlert();
  });

  it('should open Observations list and verify it is displayed', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });

  it('should toggle camera tab and back to confirm correct place', async () => {
    const cameraTab = await $('~Go to camera.');
    await cameraTab.click();

    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });

  it('should confirm newly-created observations appear in the list', async () => {
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
    await expect($(byTextMatches('Body of water'))).toBeDisplayed();
    await expect($(byTextMatches('Fungi'))).toBeDisplayed();

    await expect($(byResourceId('OBS.Tree-list-icon'))).toBeDisplayed();
    await expect(
      $(byResourceId('OBS.Body of water-list-icon')),
    ).toBeDisplayed();
    await expect($(byResourceId('OBS.Fungi-list-icon'))).toBeDisplayed();
    await expect($(byResourceId('OBS.Cave-list-icon'))).toBeDisplayed();
  });

  it('should open "Tree" observation, check details, and go back to map', async () => {
    const treeItem = await $(byTextMatches('Tree'));
    await treeItem.click();

    await expect($(byTextMatches('Tree'))).toBeDisplayed();
    // Check date format: e.g. "Oct 25, 2024"
    const dateRegex =
      '^[A-Z][a-z]{2} (0?[1-9]|[12][0-9]|3[01]), (20[2-9][4-9]|2[1-9][0-9]{2})';
    await expect($(byTextMatches(dateRegex))).toBeDisplayed();

    await expect($(byResourceId('OBS.Tree-view-icon'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
  });
});
