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
    const description = await $(
      byTextMatches(
        'Coordinate with your team to receive a project invitation',
      ),
    );
    await expect(description).toBeDisplayed();
  });

  it('should display "Close" button', async () => {
    const closeButton = await $(
      byResourceId('ONBOARDING.join-project-close-btn'),
    );
    await expect(closeButton).toBeDisplayed();
  });

  it('should navigate back to Success screen when "Close" is tapped', async () => {
    const closeButton = await $(
      byResourceId('ONBOARDING.join-project-close-btn'),
    );
    await closeButton.click();

    const deviceReadyMessage = await $(
      byTextMatches(`${output.names.device} is ready`),
    );
    await expect(deviceReadyMessage).toBeDisplayed();
  });
});
