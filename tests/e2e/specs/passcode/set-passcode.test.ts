import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Passcode - setPasscode', () => {
  it('should show passcode not set', async () => {
    await expect($(byText('Security'))).toBeDisplayed();
    await expect($(byText('App Passcode'))).toBeDisplayed();
    await expect($(byText('Passcode not set'))).toBeDisplayed();
  });

  it('should open passcode descriptor, back out of Set Passcode screen, then open it again', async () => {
    const appPasscodeItem = await $(byText('App Passcode'));
    await appPasscodeItem.click();

    await expect($(byTextMatches('What is App Passcode?'))).toBeDisplayed();
    const continueBtn = await $(byTextMatches('Continue'));
    await expect(continueBtn).toBeDisplayed();

    await continueBtn.click();

    await expect($(byTextMatches('Set App Passcode'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byTextMatches('What is App Passcode?'))).toBeDisplayed();

    await $(byTextMatches('Continue')).click();
  });

  it('should cancel passcode setup and reopen it', async () => {
    const cancelBtn = await $(byTextMatches('Cancel'));
    await cancelBtn.click();

    await expect($(byText('Security'))).toBeDisplayed();

    const appPasscodeItem = await $(byText('App Passcode'));
    await appPasscodeItem.click();

    const continueBtn = await $(byText('Continue'));
    await continueBtn.click();

    await expect($(byResourceId('SETTINGS.passcode-inp'))).toBeDisplayed();
  });

  it('should verify keyboard, handle passcode errors, then get to Re-enter screen', async () => {
    await expect(driver.isKeyboardShown());

    const nextBtn = await $(byText('Next'));
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

    await passcodeInp.setValue(output.obscurepasscode);
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect(
      $(byTextMatches('Cannot be used as a Passcode')),
    ).toBeDisplayed();

    await passcodeInp.setValue(output.passcode);
    await nextBtn.click();
    await expect($(byTextMatches('Re-enter Passcode'))).toBeDisplayed();

    await passcodeInp.setValue('54321');
    await nextBtn.click();
    await driver.hideKeyboard();
    await expect($(byTextMatches('Password does not match'))).toBeDisplayed();
  });

  it('cancel should take user back to security screen', async () => {
    const cancelBtn = await $(byText('Cancel'));
    await cancelBtn.click();
    await expect($(byText('Security'))).toBeDisplayed();
  });

  it('should finalize passcode setup, see "Passcode is set," then go back', async () => {
    const appPasscodeItem = await $(byText('App Passcode'));
    await appPasscodeItem.click();

    const continueBtn = await $(byText('Continue'));
    await continueBtn.click();

    const passcodeInput = await $(byResourceId('SETTINGS.passcode-inp'));
    await passcodeInput.setValue(output.passcode);

    const nextBtn = await $(byText('Next'));
    await nextBtn.click();

    await passcodeInput.setValue(output.passcode);
    await nextBtn.click();

    const saveBtn = await $(byTextMatches('Save App Passcode'));
    await saveBtn.click();

    await expect($(byTextMatches('Passcode is set'))).toBeDisplayed();
  });

  it('should show obscure passcode as available after passcode is set', async () => {
    const seizureText = await $(
      byTextMatches('Protect your device against seizure'),
    );
    await expect(seizureText).toBeDisplayed();
    await seizureText.click();
    await expect($(byTextMatches('Use Obscure Passcode'))).toBeDisplayed();
  });

  it('should enable obscure passcode when tapped and show the enabled view', async () => {
    const toggleBtn = await $('~Enable or Disable Obscure Passcode');
    await toggleBtn.click();

    const enabledView = await $('~Obscure Passcode is Enabled');
    await expect(enabledView).toBeDisplayed();
    if (await $(byResourceId('MAIN.header-back-btn')).isDisplayed()) {
      await $(byResourceId('MAIN.header-back-btn')).click();
    }
    if (await $(byResourceId('MAIN.header-back-btn')).isDisplayed()) {
      await $(byResourceId('MAIN.header-back-btn')).click();
    }
    if (await $(byResourceId('MAIN.header-back-btn')).isDisplayed()) {
      await $(byResourceId('MAIN.header-back-btn')).click();
    }
    if (await $(byResourceId('MAIN.map-screen')).isDisplayed()) {
      await $(byResourceId('MAIN.map-screen')).click();
    }
  });
});
