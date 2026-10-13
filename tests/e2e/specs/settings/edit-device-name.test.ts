import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Edit Device Name Test', () => {
  it('should navigate to project settings and edit the device name', async () => {
    await $('~Open Menu').tap();

    await $('~Go to app settings screen.').tap();

    await $(byResourceId('device-name-list-item')).click();

    await $(byResourceId('edit-icon')).click();
    const editDeviceNameField = await $(byResourceId('edit-device-name'));
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    await $(byResourceId('MAIN.header-back-btn')).click();

    await expect($(byText('DISCARD CHANGES'))).toBeDisplayed();

    await $(byText('DISCARD CHANGES')).click();

    await expect($(byText(output.names.device))).toBeDisplayed();

    await $(byResourceId('edit-icon')).click();
    const editDeviceNameFieldAgain = await $(byResourceId('edit-device-name'));
    await editDeviceNameFieldAgain.click();
    await editDeviceNameFieldAgain.clearValue();
    await editDeviceNameFieldAgain.setValue(output.names.editdevice);

    await $(byResourceId('MAIN.header-back-btn')).click();

    await expect($(byText('DISCARD CHANGES'))).toBeDisplayed();

    await $(byText('CONTINUE EDITING')).click();

    await expect($(byText(output.names.editdevice))).toBeDisplayed();

    await $(byResourceId('save-icon')).click();

    await expect($(byText(output.names.editdevice))).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $(byResourceId('MAIN.map-screen')).click();

    await $('~Open Menu').tap();
    await $('~Go to app settings screen.').click();
    await $(byResourceId('device-name-list-item')).click();

    await expect($(byText(output.names.editdevice))).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
