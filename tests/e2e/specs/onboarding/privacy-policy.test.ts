import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';

describe('Onboarding - Privacy Policy Screen', () => {
  it('should display Privacy Policy content', async () => {
    const learnMoreButton = await $(byText('Learn More'));
    await learnMoreButton.click();

    const privacyTitle = await $(byText('CoMapeo Data Privacy'));
    await expect(privacyTitle).toBeDisplayed();
  });

  it('should toggle "About Awana Digital" section', async () => {
    const aboutAwana = await $(byText('About Awana Digital'));
    await aboutAwana.tap();

    const aboutAwanaContent = await $(
      byTextMatches('Awana Digital, a 501c3 non-profit'),
    );
    await expect(aboutAwanaContent).toBeDisplayed();

    await aboutAwana.click();
    await driver.waitUntil(
      async () => !(await aboutAwanaContent.isExisting()),
      {
        timeout: 5000,
        timeoutMsg:
          'The about section content did not disappear within timeout',
      },
    );
  });

  it('should toggle "Open Source" section', async () => {
    const openSourceSection = await $(
      byText('Open Source and the "Official" Version'),
    );
    await openSourceSection.click();

    const openSourceContent = await $(
      byTextMatches('CoMapeo is an open-source application'),
    );
    await expect(openSourceContent).toBeDisplayed();

    await openSourceSection.click();
    await driver.waitUntil(
      async () => !(await openSourceContent.isExisting()),
      {
        timeout: 5000,
        timeoutMsg:
          'The open source section content did not disappear within timeout',
      },
    );
  });

  it('should navigate back to Data & Privacy screen', async () => {
    await driver.back();
    const backToPrivacyScreen = await $(
      byTextMatches('Your data stays on your devices'),
    );
    await expect(backToPrivacyScreen).toBeDisplayed();
  });
});
