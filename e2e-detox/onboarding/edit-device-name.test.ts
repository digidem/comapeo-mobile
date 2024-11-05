import {expect, element, by} from 'detox';

describe('Onboarding - Edit Device Name', () => {
  it('should open the side drawer menu', async () => {
    await element(by.id('drawer-icon-home')).tap();
    await expect(element(by.text('Create or Join Project'))).toBeVisible();
  });

  it('should navigate to Project Settings and select Device Name', async () => {
    await element(by.text('Project Settings')).tap();
    await element(by.text('Device Name')).tap();
    await expect(element(by.id('edit-icon'))).toBeVisible();
  });

  it('should attempt to edit device name and handle discard changes', async () => {
    await element(by.id('edit-icon')).tap();
    await element(by.id('PROJECT.edit-device-name')).tap();
    await element(by.id('PROJECT.edit-device-name')).clearText();
    await element(by.id('PROJECT.edit-device-name')).typeText(
      'New Test Device',
    );
    await element(by.id('MAIN.header-back-btn')).tap();

    await expect(element(by.text('Discard changes?'))).toBeVisible();
    await element(by.text('DISCARD CHANGES')).tap();

    await expect(element(by.text('Test Device'))).toBeVisible();
  });

  it('should successfully edit and save the new device name', async () => {
    await element(by.id('edit-icon')).tap();
    await element(by.id('PROJECT.edit-device-name')).tap();
    await element(by.id('PROJECT.edit-device-name')).clearText();
    await element(by.id('PROJECT.edit-device-name')).typeText(
      'New Test Device',
    );
    await element(by.id('save-icon')).tap();

    await expect(element(by.text('New Test Device'))).toBeVisible();
  });
});
