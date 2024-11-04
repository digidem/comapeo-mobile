import {expect} from 'detox';

describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    // don't want to reload because tests are for a continuous flow
    // await device.reloadReactNative();
  });

  it('"Get Started" button should be visible', async () => {
    await waitFor(element(by.id('ONBOARDING.get-started-btn')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('shows input for device name after tapping "Get Started"', async () => {
    await element(by.id('ONBOARDING.get-started-btn')).tap();
    await element(by.text('Next')).tap();
  });

  it('should allow for input of device name', async () => {
    await element(by.id('ONBOARDING.device-name-inp')).tap();
    await element(by.id('ONBOARDING.device-name-inp')).typeText('Test Device');
    await expect(element(by.id('ONBOARDING.add-name-btn'))).toBeVisible();
  });

  it('should display a success message when device name added', async () => {
    await element(by.id('ONBOARDING.add-name-btn')).tap();
    await expect(element(by.text('Success!'))).toBeVisible();
  });

  it('should display the device name and go to map once added', async () => {
    await expect(element(by.text('Test Device'))).toBeVisible();
    await expect(element(by.id('ONBOARDING.go-to-map-btn'))).toBeVisible();
  });
});
