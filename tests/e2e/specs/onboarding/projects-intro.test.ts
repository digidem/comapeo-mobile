import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byText, byTextMatches} from '../../utils/selectors';

describe('Onboarding - Projects Intro Test', () => {
  it('should show the Projects Intro screen with header, info, and actions', async () => {
    await expect($(byText('Secure & Private Collaborations'))).toBeDisplayed();

    await expect(
      $(byTextMatches('helps teams securely store')),
    ).toBeDisplayed();

    await expect(
      $(byTextMatches('Observations can only be shared')),
    ).toBeDisplayed();

    await expect($(byText('Join an Existing Project'))).toBeDisplayed();
    await expect($(byText('Start a New Project'))).toBeDisplayed();
    await expect($(byText('Go to Map'))).toBeDisplayed();
  });
});
