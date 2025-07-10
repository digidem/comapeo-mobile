import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byTextMatches, byResourceId} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Passcode - Check Passcode Requirements Flow', () => {
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
    await driver.pause(1000);
    // presses Back
    await driver.pressKeyCode(4);
    await driver.pressKeyCode(3);
    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
  });

  it('should handle wrong passcode, then close and reopen app, see passcode again, then correct passcode', async () => {
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.click();
    await driver.keys('54321'.split(''));
    await driver.hideKeyboard();

    await expect($(byTextMatches('Incorrect passcode'))).toBeDisplayed();
    // power button (off then on)
    await driver.pressKeyCode(26);
    // pushing power button twice opens camera on Pixel
    await driver.pause(1000);
    await driver.pressKeyCode(26);
    // some of the older phones and Android versions default to a lock screen
    if (await driver.isLocked()) await driver.unlock();

    await driver.activateApp('com.comapeo.rc');

    await expect($(byTextMatches('Enter your passcode'))).toBeDisplayed();
  });
  it('should show lockout message after 5 failed passcode attempts', async () => {
    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));

    for (let i = 0; i < 4; i++) {
      await passcodeField.click();
      await driver.keys('54321'.split(''));
      await driver.hideKeyboard();
      await driver.pause(500);
    }

    const lockoutMessage = await $(byTextMatches('Try again in 1 minute'));
    await expect(lockoutMessage).toBeDisplayed();

    const keyboardShown = await driver.isKeyboardShown();
    expect(keyboardShown).toBe(false);
  });
  it('should allow login again after lockout message disappears and 1 minute has passed', async () => {
    const timeoutMs = 66000;
    const intervalMs = 3000;
    const start = Date.now();
    let messageGone = false;

    while (Date.now() - start < timeoutMs) {
      const lockoutEls = await $$(byTextMatches('Try again in 1 minute'));
      const lockoutEl = lockoutEls[0];
      if (!lockoutEl) {
        messageGone = true;
        break;
      }

      const isVisible = await lockoutEl.isDisplayed();

      if (!isVisible) {
        messageGone = true;
        break;
      }

      await driver.pause(intervalMs);
    }
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(60000);
    expect(messageGone).toBe(true);

    const passcodeField = await $(byResourceId('SETTINGS.auth-passcode-inp'));
    await passcodeField.click();
    await driver.keys(output.passcode.split(''));
    await driver.hideKeyboard();
    const stillVisible = await $(
      byTextMatches('Enter your passcode'),
    ).isDisplayed();

    expect(stillVisible).toBe(false);
  });
});
