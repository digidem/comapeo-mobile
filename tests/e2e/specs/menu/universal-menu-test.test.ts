import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';
import {output} from '../../utils/naming';

describe('Menu - basic functionality of the menu', () => {
  it('should open on press of header', async () => {
    // this is currently not the header, but it will be changed in a subsequent PR
    const header = await $('~Open Menu');
    await header.click();

    const gatherObservations = await $(byText('Gather Observations'));
    const backgroundMaps = await $(byText('Background Maps'));
    const coMapeoSettings = await $(byText('CoMapeo Settings'));

    await expect(gatherObservations).toBeDisplayed();
    await expect(backgroundMaps).toBeDisplayed();
    await expect(coMapeoSettings).toBeDisplayed();
  });

  it('Should close menu on back button', async () => {
    await driver.back();
    const gatherObservations = await $(byText('Gather Observations'));
    const backgroundMaps = await $(byText('Background Maps'));
    const coMapeoSettings = await $(byText('CoMapeo Settings'));

    await expect(gatherObservations).not.toBeDisplayed();
    await expect(backgroundMaps).not.toBeDisplayed();
    await expect(coMapeoSettings).not.toBeDisplayed();
  });

  it('should navigate to background map screen on background map press', async () => {
    const header = await $('~Open Menu');
    await header.click();

    const backgroundMaps = await $(byText('Background Maps'));
    await backgroundMaps.click();

    expect(await $(byText('Background Map'))).toBeDisplayed();
    expect(await $(byText('Choose File'))).toBeDisplayed();
    await driver.back();
  });

  it('should navigate to app settings', async () => {
    const coMapeoSettings = await $(byText('CoMapeo Settings'));
    await coMapeoSettings.click();

    expect(await $(byText('App Settings'))).toBeDisplayed();
    expect(await $(byText('Device Name'))).toBeDisplayed();
    expect(await $(byText('Language'))).toBeDisplayed();

    await driver.back();
  });

  it('should navigate to map when gather observations clicked', async () => {
    const addObservationButton = await $(
      byResourceId('MAIN.add-observation-btn'),
    );
    //should not be visible as the menu pushes it off screen
    expect(addObservationButton).not.toBeDisplayed();

    const gatherObservations = await $(byText('Gather Observations'));
    await gatherObservations.click();

    expect(await $(byResourceId('MAIN.map-screen'))).toBeDisplayed();
    expect(addObservationButton).toBeDisplayed();
  });
});
