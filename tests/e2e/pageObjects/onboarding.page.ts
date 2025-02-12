import {$} from '@wdio/globals';
import {byResourceId, byText} from '../utils/selectors';

class OnboardingPage {
  get description() {
    return $(byText('Map your world, together'));
  }

  get getStartedButton() {
    return $(byResourceId('ONBOARDING.get-started-btn'));
  }

  get nextScreenTitle() {
    return $(byText('Data & Privacy'));
  }

  get learnMoreButton() {
    return $(byText('Learn More'));
  }

  get nextButton() {
    return $(byText('Next'));
  }

  async completeOnboarding() {
    await this.description.waitForDisplayed();
    await this.getStartedButton.waitForDisplayed();
    await this.getStartedButton.click();

    await this.nextScreenTitle.waitForDisplayed();
    await this.learnMoreButton.waitForDisplayed();
    await this.nextButton.waitForDisplayed();
    await this.nextButton.click();
  }
}

export default new OnboardingPage();
