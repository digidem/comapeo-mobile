import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText} from '../../utils/selectors';

describe('Main - Map Screen Component Test', () => {
  it('should verify map screen elements are visible', async () => {
    const mapTab = await $('~Go to Map');
    await mapTab.click();

    await expect($('~Open Menu')).toBeDisplayed();
    await expect($('~Add Observation')).toBeDisplayed();
  });

  it('should display the named project in the map screen header', async () => {
    const headerTitle = await $(byResourceId('HOME.header-title'));
    await expect(headerTitle).toBeDisplayed();
    await expect(headerTitle).toHaveText('test project');
  });

  it('should navigate to the categories screen from the map screen', async () => {
    const addObservationButton = await $('~Add Observation');
    await addObservationButton.click();

    const categoriesScreen = await $(byResourceId('MAIN.categories-scrn'));
    await expect(categoriesScreen).toBeDisplayed();
  });

  it('should discard observation and return to the map screen', async () => {
    await driver.back();
    const discardButton = await $(byText('Discard Observation'));
    await discardButton.click();

    const mapView = await $(byResourceId('MAIN.mapbox-map-view'));
    await expect(mapView).toBeDisplayed();
  });
});
