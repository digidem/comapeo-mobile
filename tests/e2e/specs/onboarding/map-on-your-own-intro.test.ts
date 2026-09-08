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
    const title = await $(byTextMatches('Explore CoMapeo on your own'));
    await expect(title).toBeDisplayed();

    const description = await $(byTextMatches('Invite collaborators anytime'));
    await expect(description).toBeDisplayed();

    const snapPhotos = await $(byTextMatches('Snap photos on-the-go'));
    await expect(snapPhotos).toBeDisplayed();

    const addAudio = await $(byTextMatches('Add audio recordings'));
    await expect(addAudio).toBeDisplayed();

    const trackPaths = await $(byTextMatches('Track paths walked'));
    await expect(trackPaths).toBeDisplayed();
  });

  it('should display header back button and "Start First Map" button', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await expect(backButton).toBeDisplayed();

    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await expect(goToMapButton).toBeDisplayed();
  });

  it('should create project and navigate to map when "Start First Map" is tapped', async () => {
    const goToMapButton = await $(byResourceId('ONBOARDING.go-to-map-btn'));
    await goToMapButton.click();

    await driver.pause(3500);
    await expect($(byResourceId('MAIN.map-screen'))).toBeDisplayed();
  });
  it('should still be on Map screen after closing app and reopening', async () => {
    await driver.terminateApp('com.comapeo.rc');
    await driver.activateApp('com.comapeo.rc');
    await driver.pause(3500);
    await expect($(byResourceId('MAIN.map-screen'))).toBeDisplayed();
  });
});
