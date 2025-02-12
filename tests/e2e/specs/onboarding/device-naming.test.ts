import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import OnboardingPage from '../../pageObjects/onboarding.page';
import {byResourceId, byTextMatches} from '../../utils/selectors';

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

    await deviceNameInput.setValue('Test Device');
    await addNameButton.click();

    await successMessage.waitForDisplayed();
    await expect(successMessage).toBeDisplayed();
  });
});
