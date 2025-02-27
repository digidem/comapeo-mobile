import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Coordinates Settings Flow', () => {
  it('should open the App Settings from the drawer', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();
  });

  it('should open Coordinate System screen', async () => {
    const coordinateSystemOption = await $(byTextMatches('Coordinate System'));
    await coordinateSystemOption.click();

    await expect($(byTextMatches('Decimal Degrees'))).toBeDisplayed();
    await expect($(byTextMatches('Degrees/Minutes/Seconds'))).toBeDisplayed();
    await expect(
      $(byTextMatches('Universal Transverse Mercator')),
    ).toBeDisplayed();
  });

  it('should select D/M/S, then back to Settings and back to map', async () => {
    const dmsOption = await $(byTextMatches('Degrees/Minutes/Seconds'));
    await dmsOption.click();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await expect($(byTextMatches('App Settings'))).toBeDisplayed();

    await backBtn.click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
