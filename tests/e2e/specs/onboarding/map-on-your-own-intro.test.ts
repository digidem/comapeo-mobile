import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Onboarding - Map On Your Own Intro Screen', () => {
  it('should navigate to Map On Your Own Intro screen', async () => {
    const mapOnYourOwnButton = await $(
      byResourceId('ONBOARDING.map-on-your-own-btn'),
    );
    await mapOnYourOwnButton.click();

    const title = await $(byTextMatches('Map On Your Own'));
    await expect(title).toBeDisplayed();
  });

  it('should display intro content with benefits', async () => {
    const description = await $(
      byTextMatches('Explore CoMapeo—invite collaborators anytime'),
    );
    await expect(description).toBeDisplayed();

    const snapPhotos = await $(byTextMatches('Snap photos on-the-go'));
    await expect(snapPhotos).toBeDisplayed();

    const addAudio = await $(byTextMatches('Add audio recordings'));
    await expect(addAudio).toBeDisplayed();

    const trackPaths = await $(byTextMatches('Track paths walked'));
    await expect(trackPaths).toBeDisplayed();
  });

  it('should display "Go to Map" and "Close" buttons', async () => {
    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await expect(goToMapButton).toBeDisplayed();

    const closeButton = await $(
      byResourceId('ONBOARDING.map-on-your-own-close-btn'),
    );
    await expect(closeButton).toBeDisplayed();
  });

  it('should create project and navigate to map when "Go to Map" is tapped', async () => {
    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await goToMapButton.click();

    await driver.pause(2000);
    await expect($(byResourceId('MAIN.map-screen'))).toBeDisplayed();
  });
});
