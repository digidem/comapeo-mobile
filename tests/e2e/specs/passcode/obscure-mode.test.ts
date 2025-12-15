import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';
import {checkForElementGone} from '../../utils/checkForGone';
import {handleGPSAlert} from '../../utils/alerts';

describe('Passcode - Obscure Passcode Mode', () => {
  it('should show an observations before going into obscure mode', async () => {
    await $('~Add Observation').click();
    const treeCategory = await $(byTextMatches('Tree'));
    await treeCategory.click();
    await driver.pause(1000);
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await handleGPSAlert();

    await $('~Go to observations list.').click();
    const tree = await $(byText('Tree'));
    await expect(tree).toBeDisplayed();
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

    await $(byTextMatches('Animal')).click();

    await driver.pause(1000);
    const saveBtn = await $(byResourceId('OBS.edit-save-btn'));
    await saveBtn.click();
    await handleGPSAlert();
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
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
    checkForElementGone(byText('Animal'));
  });
});
