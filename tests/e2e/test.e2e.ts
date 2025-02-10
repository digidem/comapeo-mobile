import {expect, $} from '@wdio/globals';
import {describe, it} from 'mocha';

describe('CoMapeo App Tests', () => {
  it('should launch the app, grant permissions, and navigate to the next screen', async () => {
    await browser.pause(15000);
    const description = await $(
      'android=new UiSelector().text("Map your world, together")',
    );
    await description.waitForDisplayed();
    await expect(description).toBeDisplayed();

    const getStartedButton = await $(
      'android=new UiSelector().resourceId("ONBOARDING.get-started-btn")',
    );
    await getStartedButton.waitForDisplayed();
    await getStartedButton.click();

    const nextScreenTitle = await $(
      'android=new UiSelector().text("Data & Privacy")',
    );
    await nextScreenTitle.waitForDisplayed();

    const learnMoreButton = await $(
      'android=new UiSelector().text("Learn More")',
    );
    await learnMoreButton.waitForDisplayed();
    await expect(learnMoreButton).toBeDisplayed();

    const nextButton = await $('android=new UiSelector().text("Next")');
    await nextButton.waitForDisplayed();
    await expect(nextButton).toBeDisplayed();
  });
});
