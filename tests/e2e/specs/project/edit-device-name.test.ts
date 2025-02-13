import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Edit Device Name Test', () => {
  it('should navigate to project settings and edit the device name', async () => {
    const drawerIcon = await $(byResourceId('drawer-icon-home'));
    await drawerIcon.click();

    const projectSettingsItem = await $(byText('Project Settings'));
    await projectSettingsItem.click();

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

    const discardAlert = await $(byTextMatches('.*DISCARD CHANGES.*'));
    await expect(discardAlert).toBeDisplayed();

    await discardAlert.click();

    const originalDeviceName = await $(byText(output.names.device));
    await expect(originalDeviceName).toBeDisplayed();

    await editIcon.click();
    await editDeviceNameField.click();
    await editDeviceNameField.clearValue();
    await editDeviceNameField.setValue(output.names.editdevice);

    await backButton.click();

    const discardAlertSecond = await $(byTextMatches('.*DISCARD CHANGES.*'));
    await expect(discardAlertSecond).toBeDisplayed();

    const continueEditing = await $(byTextMatches('.*CONTINUE EDITING.*'));
    await continueEditing.click();

    const editedDeviceName = await $(byText(output.names.editdevice));
    await expect(editedDeviceName).toBeDisplayed();

    const saveIcon = await $(byResourceId('save-icon'));
    await saveIcon.click();

    await expect(editedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
    await drawerIcon.click();
    await projectSettingsItem.click();
    await deviceNameListItem.click();

    const persistedDeviceName = await $(byText(output.names.editdevice));
    await expect(persistedDeviceName).toBeDisplayed();

    await driver.back();
    await driver.back();
  });
});
