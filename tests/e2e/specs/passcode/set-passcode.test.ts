import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Set Passcode Flow', () => {
  it('should navigate to Security screen from drawer', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();

    const securityOption = await $(byTextMatches('Security'));
    await securityOption.click();

    await expect($(byTextMatches('Security'))).toBeDisplayed();
    await expect($(byTextMatches('App Passcode'))).toBeDisplayed();
    await expect($(byTextMatches('Passcode not set'))).toBeDisplayed();
  });

  it('should open and back out of "What is App Passcode?" screen', async () => {
    const appPasscodeText = await $(byTextMatches('App Passcode'));
    await appPasscodeText.click();

    await expect($(byTextMatches('What is App Passcode?'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await expect($(byTextMatches('Security'))).toBeDisplayed();
  });

  it('should open passcode descriptor, back out of Set Passcode screen, then open it again', async () => {
    const appPasscodeText = await $(byTextMatches('App Passcode'));
    await appPasscodeText.click();

    await expect(
      $(byTextMatches('additional layer of security')),
    ).toBeDisplayed();
    const continueBtn = await $(byTextMatches('Continue'));
    await expect(continueBtn).toBeDisplayed();

    await continueBtn.click();

    await expect($(byTextMatches('Set App Passcode'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byTextMatches('What is App Passcode?'))).toBeDisplayed();

    await continueBtn.click();
  });

  it('should cancel passcode setup and reopen it', async () => {
    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();

    await expect($(byTextMatches('Security'))).toBeDisplayed();

    const appPasscodeText = await $(byTextMatches('App Passcode'));
    await appPasscodeText.click();

    const continueBtn = await $(byTextMatches('Continue'));
    await continueBtn.click();

    await expect($(byResourceId('SETTINGS.passcode-inp'))).toBeDisplayed();
  });

  it('should verify keyboard, handle passcode errors, then get to Re-enter screen', async () => {
    await expect(driver.isKeyboardShown());

    const nextBtn = await $(byTextMatches('Next'));
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect(
      $(byTextMatches('Password must be 5 numbers')),
    ).toBeDisplayed();

    const passcodeInp = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeInp.setValue('22');
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect(
      $(byTextMatches('Password must be 5 numbers')),
    ).toBeDisplayed();

    await passcodeInp.setValue('00000');
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect(
      $(byTextMatches('Cannot be used as a Passcode')),
    ).toBeDisplayed();

    await passcodeInp.setValue(output.passcode);
    await nextBtn.click();
    await expect($(byTextMatches('Re-enter Passcode'))).toBeDisplayed();
  });

  it('should handle going back from re-enter, open it again, mismatch passcode, then see bottom sheet', async () => {
    let backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byTextMatches('What is App Passcode?'))).toBeDisplayed();

    const continueBtn = await $(byTextMatches('Continue'));
    await continueBtn.click();

    const passcodeInput = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeInput.setValue(output.passcode);
    const nextBtn = await $(byTextMatches('Next'));
    await nextBtn.click();

    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();
    await expect($(byTextMatches('Security'))).toBeDisplayed();

    const appPasscodeText = await $(byTextMatches('App Passcode'));
    await appPasscodeText.click();
    await continueBtn.click();

    await passcodeInput.setValue(output.passcode);
    await nextBtn.click();

    await expect(driver.isKeyboardShown());

    await passcodeInput.setValue('54321');
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect($(byTextMatches('Password does not match'))).toBeDisplayed();

    await passcodeInput.setValue(output.passcode);
    await nextBtn.click();
    await expect(
      $(byTextMatches('App Passcodes can never be recovered')),
    ).toBeDisplayed();
    await expect($(byTextMatches(output.passcode))).toBeDisplayed();

    await cancelBtn.click();
    await expect($(byTextMatches('Security'))).toBeDisplayed();
  });

  it('should finalize passcode setup, see "Passcode is set," then go back', async () => {
    const appPasscodeText = await $(byTextMatches('App Passcode'));
    await appPasscodeText.click();

    const continueBtn = await $(byTextMatches('Continue'));
    await continueBtn.click();

    const passcodeInput = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeInput.setValue(output.passcode);

    const nextBtn = await $(byTextMatches('Next'));
    await nextBtn.click();

    await passcodeInput.setValue(output.passcode);
    await nextBtn.click();

    const saveBtn = await $(byTextMatches('Save App Passcode'));
    await saveBtn.click();

    await expect($(byTextMatches('Passcode is set'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Close Navigation Drawer').click();
  });
});
