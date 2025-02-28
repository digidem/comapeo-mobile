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
    // should put app in the background
    // keycode 3 is home button
    await driver.pressKeyCode(3);
    // if I figure out how, this should involve opening another app in between
    await driver.pause(2000);
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
  });

  it('should handle wrong passcode, then close and reopen app, see passcode again, then correct passcode', async () => {
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.setValue('54321');

    await expect($(byTextMatches('Incorrect passcode'))).toBeDisplayed();
    // if I figure out how, this should be turn phone on and off instead
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();

    await passcodeField.setValue(output.passcode);
  });
});
