import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Observations - should show download options', () => {
  it('should open an empty Observations list with no download button', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('observationsEmptyView'))).toBeDisplayed();
    await expect($(byText('Download'))).not.toBeDisplayed();
  });

  it('should create observation with "Lake" category', async () => {
    const mapBtn = await $('~Go to map.');
    await mapBtn.click();
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

  it('should open Observations list and download button', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byText('Download Observations'))).toBeDisplayed();
  });

  it('should open Export Observations bottom screen', async () => {
    const downloadObsBtn = await $(byText('Download Observations'));
    await downloadObsBtn.click();
    await expect($(byText('All Observations'))).toBeDisplayed();
    await expect($(byText('All Observations with Media'))).toBeDisplayed();
  });

  it('should open show error if no option is chosed', async () => {
    const downloadBtn = await $(byText('Download'));
    await downloadBtn.click();
    await expect($(byText('Choose an option'))).toBeDisplayed();
  });

  it('should hide error if option is chosen', async () => {
    const AllObsBtn = await $(byText('All Observations'));
    await AllObsBtn.click();
    await expect($(byText('Choose an option'))).not.toBeDisplayed();
  });

  it('should open download screen when pressing download', async () => {
    const downloadBtn = await $(byText('Download'));
    await downloadBtn.click();
    await expect($(byText('SAVE'))).toBeDisplayed();
    await driver.back();
  });

  it('should close bottom sheet on pressing close', async () => {
    const closeBtn = await $(byText('Close'));
    await closeBtn.click();
    await expect($(byText('All Observations'))).not.toBeDisplayed();
    await expect($(byText('All Observations with Media'))).not.toBeDisplayed();
    // reset state back to map
    const mapBtn = await $('~Go to map.');
    await mapBtn.click();
  });
});
