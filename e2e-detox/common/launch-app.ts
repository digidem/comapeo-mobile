import {device, expect, element, by, waitFor} from 'detox';

describe('Launch App', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should display the "Get Started" button on launch', async () => {
    await waitFor(element(by.id('ONBOARDING.get-started-btn')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('ONBOARDING.get-started-btn'))).toBeVisible();
  });
});
