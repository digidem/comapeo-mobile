import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Menu - basic functionality of the menu', () => {
  it('should open on press of header', async () => {
    // this is currently not the header, but it will be changed in a subsequent PR
    const header = await $('~Open Menu');
    await header.click();

    const gatherObservations = await $(byText('Gather Observations'));
    const backgroundMaps = await $(byText('Background Map'));
    const coMapeoSettings = await $(byText('CoMapeo Settings'));

    await expect(gatherObservations).toBeDisplayed();
    await expect(backgroundMaps).toBeDisplayed();
    await expect(coMapeoSettings).toBeDisplayed();
  });

  it('Should close menu on back button', async () => {
    await driver.back();
    const gatherObservations = await $(byText('Gather Observations'));
    const backgroundMaps = await $(byText('Background Map'));
    const coMapeoSettings = await $(byText('CoMapeo Settings'));

    await expect(gatherObservations).not.toBeDisplayed();
    await expect(backgroundMaps).not.toBeDisplayed();
    await expect(coMapeoSettings).not.toBeDisplayed();
    await expect($(byResourceId('MAIN.map-screen'))).toBeDisplayed();
  });

  it('should navigate to background map screen on background map press', async () => {
    const header = await $('~Open Menu');
    await header.click();

    const backgroundMaps = await $(byText('Background Map'));
    await backgroundMaps.click();

    await expect(await $(byText('Background Map'))).toBeDisplayed();
    await driver.pause(2000);
    await expect(await $(byTextMatches('Choose File'))).toBeDisplayed();
    await driver.back();
  });

  it('should navigate to app settings', async () => {
    const coMapeoSettings = await $(byTextMatches('CoMapeo Settings'));
    await coMapeoSettings.click();

    await expect(await $(byText('CoMapeo Settings'))).toBeDisplayed();
    await expect(await $(byText('Device Name'))).toBeDisplayed();
    await expect(await $(byText('Language'))).toBeDisplayed();

    await driver.back();
  });

  it('should navigate to map when gather observations clicked', async () => {
    const addObservationButton = await $(
      byResourceId('MAIN.add-observation-btn'),
    );
    //should not be visible as the menu pushes it off screen
    await expect(addObservationButton).not.toBeDisplayed();

    const gatherObservations = await $(byText('Gather Observations'));
    await gatherObservations.click();

    const mapScreen = await $(byResourceId('MAIN.map-screen'));

    await expect(mapScreen).toBeDisplayed();
    await expect(addObservationButton).toBeDisplayed();

    const obsListTab = await $('~Go to observations list.');

    await obsListTab.click();
    const observationView = await $(byResourceId('observationsEmptyView'));

    await expect(observationView).toBeDisplayed();

    const header = await $('~Open Menu');

    await header.click();

    await gatherObservations.click();

    await expect(observationView).not.toBeDisplayed();

    await expect(mapScreen).toBeDisplayed();
    await expect(addObservationButton).toBeDisplayed();
  });
});
