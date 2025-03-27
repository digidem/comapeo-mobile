import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';

describe('Passcode - Obscure Passcode Visibility', () => {
  it('should show "To use, turn on App Passcode" if passcode is not set', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();

    const securityOption = await $(byText('Security'));
    await securityOption.click();

    const obscurePassItem = await $(byText('Obscure Passcode'));
    await expect(obscurePassItem).toBeDisplayed();

    const obscurePassNotYetAvailable = await $(
      byTextMatches('To use, turn on App Passcode'),
    );
    await expect(obscurePassNotYetAvailable).toBeDisplayed();
    obscurePassNotYetAvailable.click();
    await expect($(byText('Security'))).toBeDisplayed();
    const colorProp = await obscurePassNotYetAvailable.getCSSProperty('color');
    await expect(colorProp.parsed.hex).toEqual('#BC271A');
  });
});
