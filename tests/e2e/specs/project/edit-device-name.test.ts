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

    const deviceNameListItem = await $(
      byResourceId('PROJECT.device-name-list-item'),
    );
    await deviceNameListItem.click();

    const editIcon = await $(byResourceId('edit-icon'));
    await editIcon.click();
    const editDeviceNameField = await $(
      byResourceId('PROJECT.edit-device-name'),
    );
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const discardAlert = await $(byTextMatches('DISCARD CHANGES'));
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

    const continueEditing = await $(byTextMatches('CONTINUE EDITING'));
    await continueEditing.click();

    const editedDeviceName = await $(byText(output.names.editdevice));
    await expect(editedDeviceName).toBeDisplayed();

    const saveIcon = await $(byResourceId('save-icon'));
    await saveIcon.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $('~Close Navigation Drawer').click();

    await drawerIcon.tap();
    await projectSettingsItem.click();
    await deviceNameListItem.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await $('~Close Navigation Drawer').click();
  });
});
