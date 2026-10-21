import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Onboarding - Always Stay Notified Screen', () => {
  it('should display the notification permission request', async () => {
    const title = await $(byTextMatches('Always Stay Notified'));
    await expect(title).toBeDisplayed();

    const subtitle = await $(
      byTextMatches('Notifications allow CoMapeo to do the following'),
    );
    await expect(subtitle).toBeDisplayed();

    const allowButton = await $(
      byResourceId('ONBOARDING.notifications-allow-btn'),
    );
    await expect(allowButton).toBeDisplayed();
  });

  it('should continue to the success screen after declining', async () => {
    const notNowButton = await $(
      byResourceId('ONBOARDING.notifications-not-now-btn'),
    );
    await notNowButton.click();

    const deviceReadyMessage = await $(
      byTextMatches(`${output.names.device} is ready`),
    );
    await expect(deviceReadyMessage).toBeDisplayed();
  });
});
