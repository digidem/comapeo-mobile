import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Onboarding - Success Screen', () => {
  it('should display device ready message and mapping options', async () => {
    const deviceReadyMessage = await $(
      byTextMatches(`${output.names.device} is ready`),
    );
    await expect(deviceReadyMessage).toBeDisplayed();

    const subtitle = await $(
      byTextMatches('Coordinate with team to start or map on your own'),
    );
    await expect(subtitle).toBeDisplayed();

    const snapPhotos = await $(byTextMatches('Snap photos on-the-go'));
    await expect(snapPhotos).toBeDisplayed();

    const addAudio = await $(byTextMatches('Add audio recordings'));
    await expect(addAudio).toBeDisplayed();

    const trackPaths = await $(byTextMatches('Track paths walked'));
    await expect(trackPaths).toBeDisplayed();
  });

  it('should display "Start Mapping" button', async () => {
    const startMappingButton = await $(
      byResourceId('ONBOARDING.map-on-your-own-btn'),
    );
    await expect(startMappingButton).toBeDisplayed();
  });

  it('should create project and navigate to map when "Start Mapping" is tapped', async () => {
    const startMappingButton = await $(
      byResourceId('ONBOARDING.map-on-your-own-btn'),
    );
    await startMappingButton.click();

    await driver.pause(2000);
    await expect($(byResourceId('MAIN.map-screen'))).toBeDisplayed();
  });
});
