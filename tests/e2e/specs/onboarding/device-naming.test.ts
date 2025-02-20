import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Device Naming Test', () => {
  it('should navigate to Device Naming screen after tapping "Next"', async () => {
    const nextButton = await $(byText('Next'));
    await nextButton.click();
  });

  it('should input a device name and verify success message', async () => {
    const deviceNameInput = await $(byResourceId('ONBOARDING.device-name-inp'));
    await expect(deviceNameInput).toBeDisplayed();
    const addNameButton = await $(byResourceId('ONBOARDING.add-name-btn'));

    await addNameButton.click();

    const successMessage = await $(byTextMatches('Success'));
    await driver.waitUntil(async () => !(await successMessage.isExisting()), {
      timeout: 5000,
      timeoutMsg: 'The success message did not appear within timeout',
    });

    await deviceNameInput.setValue(output.names.device);
    await addNameButton.click();

    await expect(successMessage).toBeDisplayed();

    const addedDeviceName = await $(byText(output.names.device));
    await expect(addedDeviceName).toBeDisplayed();

    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await expect(goToMapButton).toBeDisplayed();
    await goToMapButton.click();
  });
});
