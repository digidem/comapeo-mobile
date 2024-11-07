import {expect, element, by, waitFor} from 'detox';

describe('Onboarding - Create Device Name', () => {
  it('should navigate to Device Naming screen after tapping "Next"', async () => {
    await element(by.text('Next')).tap();
    await expect(element(by.id('ONBOARDING.device-name-inp'))).toBeVisible();
  });

  it('should allow input of device name and show success message', async () => {
    await element(by.id('ONBOARDING.device-name-inp')).tap();
    await element(by.id('ONBOARDING.device-name-inp')).typeText('Test Device');
    await element(by.id('ONBOARDING.device-name-inp')).tapReturnKey();
    await element(by.id('ONBOARDING.add-name-btn')).tap();
    await expect(element(by.text('Success!'))).toBeVisible();
    await expect(element(by.text('Test Device'))).toBeVisible();
  });

  it('should navigate to the map after tapping "Go to Map"', async () => {
    await element(by.id('ONBOARDING.go-to-map-btn')).tap();
    await waitFor(element(by.id('MAIN.mapbox-map-view')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
