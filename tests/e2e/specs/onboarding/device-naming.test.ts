import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import OnboardingPage from '../../pageObjects/onboarding.page';
import {byResourceId, byTextMatches, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Device Naming Test', () => {
  it('should input a device name and verify success message', async () => {
    await OnboardingPage.completeOnboarding();

    const deviceNameInput = await $(byResourceId('ONBOARDING.device-name-inp'));
    const addNameButton = await $(byResourceId('ONBOARDING.add-name-btn'));

    await deviceNameInput.waitForDisplayed();
    await addNameButton.waitForDisplayed();
    await addNameButton.click();

    const successMessage = await $(byTextMatches('.*Success.*'));
    await expect(successMessage).not.toBeDisplayed();

    await deviceNameInput.setValue(output.names.device);
    await addNameButton.click();

    await successMessage.waitForDisplayed();
    await expect(successMessage).toBeDisplayed();

    const addedDeviceName = await $(byText(output.names.device));
    await expect(addedDeviceName).toBeDisplayed();

    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await expect(goToMapButton).toBeDisplayed();
    await goToMapButton.click();
  });
});
