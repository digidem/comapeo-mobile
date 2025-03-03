import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Check Passcode Requirements Flow', () => {
  it('should relaunch app and see Passcode entry screen', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
    await expect($(byResourceId('SETTINGS.auth-passcode-inp'))).toBeDisplayed();

    await expect(driver.isKeyboardShown());
  });

  it('should press Home, then return to see passcode screen again', async () => {
    // presses the home button
    await driver.pressKeyCode(3);
    // activates the calendar app
    await driver.pressKeyCode(208);
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
  });

  it('should handle wrong passcode, then close and reopen app, see passcode again, then correct passcode', async () => {
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.setValue('54321');

    await expect($(byTextMatches('Incorrect passcode'))).toBeDisplayed();
    // power button (off then on)
    await driver.pressKeyCode(26);
    await driver.pressKeyCode(26);

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();

    await passcodeField.setValue(output.passcode);
  });
});
