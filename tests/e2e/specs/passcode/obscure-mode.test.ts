import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Obscure Passcode Seizure Mode', () => {
  it('should show a blank Observations screen after entering obscure passcode', async () => {
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    await expect($(byTextMatches('Lake'))).toBeDisplayed();
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');
    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.setValue(output.obscurepasscode);
    await driver.hideKeyboard();

    await obsListTab.click();
    const emptyStateText = await $(
      byTextMatches(
        'Start from map or camera view to record your first observation.',
      ),
    );
    await expect(emptyStateText).toBeDisplayed();
    const mapTab = await $('~Go to Map');
    await mapTab.click();
  });

  it('should not save an observation after entering obscure passcode', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const animalCategory = await $(byTextMatches('Animal'));
    await animalCategory.click();

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
    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    const emptyStateText = await $(
      byTextMatches(
        'Start from map or camera view to record your first observation.',
      ),
    );
    await expect(emptyStateText).toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
  });
  it('should not show security after entering obscure passcode', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();
    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();

    await expect($(byText('Security'))).not.toBeDisplayed();
  });
  it('should show Observations again after entering regular passcode but not new observation', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');
    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.setValue(output.passcode);
    await driver.hideKeyboard();

    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();
    await expect($(byTextMatches('Lake'))).toBeDisplayed();
    await expect($(byText('Animal'))).not.toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
  });
});
