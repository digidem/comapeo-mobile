import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Project - Edit Device Name Test', () => {
  it('should navigate to project settings and edit the device name', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.tap();

    const appSettingsItem = await $('~Go to app settings screen.');
    await appSettingsItem.tap();

    const deviceNameListItem = await $(byResourceId('device-name-list-item'));
    await deviceNameListItem.click();

    const editIcon = await $(byResourceId('edit-icon'));
    await editIcon.click();
    const editDeviceNameField = await $(byResourceId('edit-device-name'));
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const discardAlert = await $(byText('DISCARD CHANGES'));
    await expect(discardAlert).toBeDisplayed();

    await discardAlert.click();

    const originalDeviceName = await $(byText(output.names.device));
    await expect(originalDeviceName).toBeDisplayed();

    await editIcon.click();
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    await backButton.click();

    await expect(discardAlert).toBeDisplayed();

    const continueEditing = await $(byText('CONTINUE EDITING'));
    await continueEditing.click();

    const editedDeviceName = await $(byText(output.names.editdevice));
    await expect(editedDeviceName).toBeDisplayed();

    const saveIcon = await $(byResourceId('save-icon'));
    await saveIcon.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $(byResourceId('MAIN.map-screen')).click();

    await drawerIcon.tap();
    await appSettingsItem.click();
    await deviceNameListItem.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
