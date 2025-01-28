import {expect, browser, $} from '@wdio/globals';

describe('CoMapeo App Tests', () => {
  it('should launch the app, grant permissions, and navigate to the next screen', async () => {
    await browser.execute('mobile: grantPermissions', {
      permissions: [
        'android.permission.CAMERA',
        'android.permission.ACCESS_FINE_LOCATION',
      ],
    });

    const splashScreen = await $('~CoMapeo');
    await expect(splashScreen).toBeDisplayed();

    const appTitle = await $('~CoMapeo');
    await expect(appTitle).toHaveText('CoMapeo');
    const description = await $('~Map your world, together');
    await expect(description).toBeDisplayed();

    const getStartedButton = await $('~ONBOARDING.get-started-btn');
    await expect(getStartedButton).toBeClickable();
    await getStartedButton.click();

    const nextScreenTitle = await $('~Data & Privacy');
    await expect(nextScreenTitle).toBeDisplayed();

    const learnMoreButton = await $('~Learn More');
    const nextButton = await $('~Next');
    await expect(learnMoreButton).toBeDisplayed();
    await expect(nextButton).toBeDisplayed();
  });
});
