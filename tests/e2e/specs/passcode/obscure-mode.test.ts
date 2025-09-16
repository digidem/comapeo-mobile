import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Passcode - Obscure Passcode Mode', () => {
  it('should show an observations before going into obscure mode', async () => {
    await $('~Add Observation').click();
    await $(byTextMatches('Airstrip')).click();
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await driver.pause(1000);

    try {
      const text = await driver.getAlertText();
      if (text.includes('No GPS signal') || text.includes('Weak GPS signal')) {
        await driver.execute('mobile:acceptAlert', {
          buttonLabel: 'SAVE',
        });
      }
    } catch {
      console.log('No alert found');
    }

    await $('~Go to observations list.').click();
    const airstrip = await $(byText('Airstrip'));
    await expect(airstrip).toBeDisplayed();
  });

  it('should show a blank Observations screen after entering obscure passcode', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');
    if (await driver.isLocked()) await driver.unlock();
    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.click();
    await driver.keys(output.obscurepasscode.split(''));
    await driver.hideKeyboard();
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.waitForDisplayed();
    await obsListTab.click();
    const emptyStateText = await $(
      byTextMatches(
        'Start from map or camera view to record your first observation.',
      ),
    );
    await expect(emptyStateText).toBeDisplayed();
    const mapTab = await $('~Go to map.');
    await mapTab.click();
  });

  it('should not save an observation after entering obscure passcode', async () => {
    const addObsBtn = await $('~Add Observation');
    await addObsBtn.click();

    const animalCategory = await $(byTextMatches('Animal'));
    await animalCategory.click();

    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    try {
      const text = await driver.getAlertText();
      if (text.includes('No GPS signal') || text.includes('Weak GPS signal')) {
        await driver.execute('mobile:acceptAlert', {buttonLabel: 'SAVE'});
      }
    } catch {
      console.log('No RN Alert dialog was found.');
    }
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    const emptyStateText = await $(
      byTextMatches(
        'Start from map or camera view to record your first observation.',
      ),
    );
    await expect(emptyStateText).toBeDisplayed();
  });

  it('should not show security after entering obscure passcode', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();

    checkForElementGone(byText('Security'));
  });
  it('should show Observations again after entering regular passcode but not new observation', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');
    if (await driver.isLocked()) await driver.unlock();
    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();

    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.click();
    await driver.keys(output.passcode.split(''));
    await driver.hideKeyboard();

    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byTextMatches('Airstrip'))).toBeDisplayed();
    checkForElementGone(byText('Animal'));
  });
});
