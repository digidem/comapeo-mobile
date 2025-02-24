import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Edit Device Name Test', () => {
  it('should navigate to project settings and edit the device name', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.tap();

    const projectSettingsItem = await $('~Go to Project Settings');
    await projectSettingsItem.tap();

    const deviceNameListItem = $(byResourceId('PROJECT.device-name-list-item'));
    await deviceNameListItem.click();

    const editIcon = $(byResourceId('edit-icon'));
    await editIcon.click();

    const editDeviceNameField = $(byResourceId('PROJECT.edit-device-name'));
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    const backButton = $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const discardAlert = $(byTextMatches('DISCARD CHANGES'));
    await expect(discardAlert).toBeDisplayed();

    await discardAlert.click();

    const originalDeviceName = $(byText(output.names.device));
    await expect(originalDeviceName).toBeDisplayed();

    await editIcon.click();
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    await backButton.click();

    await expect(discardAlert).toBeDisplayed();

    const continueEditing = $(byTextMatches('CONTINUE EDITING'));
    await continueEditing.click();

    const editedDeviceName = $(byText(output.names.editdevice));
    await expect(editedDeviceName).toBeDisplayed();

    const saveIcon = $(byResourceId('save-icon'));
    await saveIcon.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await drawerIcon.click();
    await projectSettingsItem.click();
    await deviceNameListItem.click();

    const persistedDeviceName = $(byText(output.names.editdevice));
    await expect(persistedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
  });
});
