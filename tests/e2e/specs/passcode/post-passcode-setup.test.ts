import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byText, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Post Passcode Setup Flow', () => {
  it('should navigate to Security and see "Enter Passcode" if passcode is set', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();

    const securityOption = await $(byText('Security'));
    await securityOption.click();

    const appPasscodeItem = await $(byText('App Passcode'));
    await expect($(byText('Passcode is set'))).toBeDisplayed();
    await appPasscodeItem.click();

    await expect($(byTextMatches('Enter Passcode'))).toBeDisplayed();
    await expect($(byResourceId('SETTINGS.passcode-inp'))).toBeDisplayed();

    await expect(driver.isKeyboardShown());

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect(securityOption).toBeDisplayed();
  });

  it('should cancel passcode entry, then try with wrong passcode, then correct passcode', async () => {
    const appPasscodeItem = await $(byText('App Passcode'));
    await appPasscodeItem.click();

    const cancelBtn = await $(byText('Cancel'));
    await cancelBtn.click();

    await expect($(byTextMatches('Security'))).toBeDisplayed();

    await appPasscodeItem.click();

    const passcodeField = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeField.setValue(output.newpasscode);
    await expect($(byText('Incorrect Passcode'))).toBeDisplayed();

    await passcodeField.setValue(output.passcode);

    await expect(appPasscodeItem).toBeDisplayed();
  });

  it('should see "Use App Passcode" is checked, see "Change App Passcode," and cancel out', async () => {
    await expect(
      $(byTextMatches('App passcode adds an additional layer')),
    ).toBeDisplayed();

    await expect($(byResourceId('SETTINGS.passcode-checked'))).toBeDisplayed();

    const changeBtn = await $(byText('Change App Passcode'));

    await expect(changeBtn).toBeDisplayed();

    await changeBtn.click();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await expect(changeBtn).toBeDisplayed();
    await changeBtn.click();

    const cancelBtn = await $(byText('Cancel'));
    await cancelBtn.click();

    await expect($(byText('Security'))).toBeDisplayed();
  });

  it('should re-enter passcode, change it, confirm new passcode, then uncheck passcode usage', async () => {
    const appPasscodeItem = await $(byText('App Passcode'));
    await appPasscodeItem.click();

    const passcodeField = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeField.setValue(output.passcode);
    await expect($(byTextMatches('App Passcode adds'))).toBeDisplayed();

    const changeBtn = await $(byTextMatches('Change App Passcode'));
    await changeBtn.click();

    await passcodeField.setValue(output.newpasscode);
    const nextBtn = await $(byTextMatches('Next'));
    await nextBtn.click();
    await passcodeField.setValue(output.newpasscode);
    await nextBtn.click();

    const saveBtn = await $(byTextMatches('Save App Passcode'));
    await saveBtn.click();

    await appPasscodeItem.click();
    await passcodeField.setValue(output.newpasscode);

    const passcodeCheckbox = await $(byResourceId('SETTINGS.passcode-checked'));
    await passcodeCheckbox.click();

    const turnOffText = await $(byTextMatches('Turn Off App Passcode?'));

    await expect(turnOffText).toBeDisplayed();

    const cancelTurnOff = await $(byText('Cancel'));
    await cancelTurnOff.click();

    await driver.waitUntil(async () => !(await turnOffText.isExisting()), {
      timeout: 5000,
      timeoutMsg: 'The turn off btn did not appear within timeout',
    });

    const turnOffBtn = await $(byText('Turn Off'));

    await passcodeCheckbox.click();
    await turnOffBtn.click();

    await expect($(byTextMatches('Passcode not set'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await backBtn.click();
  });
});
