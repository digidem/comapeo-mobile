import {expect, element, by, device} from 'detox';

describe('Onboarding - Data & Privacy Screen', () => {
  it('should display Data & Privacy screen after tapping "Get Started"', async () => {
    await element(by.id('ONBOARDING.get-started-btn')).tap();
    await expect(
      element(
        by.text(
          'CoMapeo allows you and your collaborators to map offline without needing servers.',
        ),
      ),
    ).toBeVisible();
  });

  it('should display "Learn More" and "Next" buttons', async () => {
    await expect(element(by.text('Learn More'))).toBeVisible(100);
    await expect(element(by.text('Next'))).toBeVisible(100);
  });

  it('should navigate to Privacy Policy when "Learn More" is tapped', async () => {
    await element(by.text('Learn More')).tap();
    await expect(element(by.text('Privacy Policy'))).toBeVisible();
    await device.pressBack();
  });

  it('should navigate to Device Naming screen after tapping "Next"', async () => {
    await element(by.text('Next')).tap();
    await expect(element(by.id('ONBOARDING.device-name-inp'))).toBeVisible();
    await device.pressBack();
  });
});
