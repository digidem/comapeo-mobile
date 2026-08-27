import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Onboarding - Join Project Intro Screen', () => {
  it('should navigate to Join Project Intro screen', async () => {
    const joinProjectButton = await $(
      byResourceId('ONBOARDING.join-project-btn'),
    );
    await joinProjectButton.click();

    const title = await $(byTextMatches('Join a Project'));
    await expect(title).toBeDisplayed();
  });

  it('should display intro content', async () => {
    await expect($(byTextMatches('Coordinate with your team'))).toBeDisplayed();

    await expect(
      $(
        byTextMatches(
          'Ask a project coordinator to receive a project invitation',
        ),
      ),
    ).toBeDisplayed();
  });

  it('should display header back button', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await expect(backButton).toBeDisplayed();
  });

  it('should navigate back to Success screen when back button is tapped', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const deviceReadyMessage = await $(
      byTextMatches(`${output.names.device} is ready`),
    );
    await expect(deviceReadyMessage).toBeDisplayed();
  });
});
