import {expect, $} from '@wdio/globals';

describe('CoMapeo App Tests', () => {
  it('should launch the app, grant permissions, and navigate to the next screen', async () => {
    const description = await $('~Map your world, together');
    await description.waitForDisplayed({timeout: 10000});
    await expect(description).toBeDisplayed();

    const getStartedButton = await $('~ONBOARDING.get-started-btn');
    await getStartedButton.waitForClickable({timeout: 10000});
    await getStartedButton.click();

    const nextScreenTitle = await $('~Data & Privacy');
    await nextScreenTitle.waitForDisplayed({timeout: 10000});

    const learnMoreButton = await $('~Learn More');
    const nextButton = await $('~Next');
    await expect(learnMoreButton).toBeDisplayed();
    await expect(nextButton).toBeDisplayed();
  });
});
