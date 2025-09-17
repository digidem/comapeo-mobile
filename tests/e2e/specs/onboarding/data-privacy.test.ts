import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Onboarding - Data & Privacy Screen', () => {
  it('should display Data & Privacy screen after tapping "Get Started"', async () => {
    const getStartedButton = await $(
      byResourceId('ONBOARDING.get-started-btn'),
    );
    await getStartedButton.click();

    const privacyText = await $(
      byTextMatches('map offline without needing servers'),
    );
    await expect(privacyText).toBeDisplayed();
  });

  it('should display "Learn More" and "Next" buttons', async () => {
    const learnMoreButton = await $(byText('Learn More'));
    const nextButton = await $(byText('Next'));

    await expect(learnMoreButton).toBeDisplayed();
    await expect(nextButton).toBeDisplayed();
  });

  it('should navigate to Privacy Policy when "Learn More" is tapped', async () => {
    const learnMoreButton = await $(byText('Learn More'));
    await learnMoreButton.click();

    const privacyPolicyTitle = await $(byText('Privacy Policy'));
    await expect(privacyPolicyTitle).toBeDisplayed();

    await driver.back();
  });
});
