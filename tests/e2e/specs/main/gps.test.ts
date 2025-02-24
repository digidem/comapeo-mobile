import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('GPS Component Test', () => {
  it('should verify GPS details on the home map screen', async () => {
    const mapView = await $(byResourceId('MAIN.mapbox-map-view'));
    await expect(mapView).toBeDisplayed();

    const gpsStatus = await $(byTextMatches('m|Searching'));
    await expect(gpsStatus).toBeDisplayed();
  });

  it('should verify GPS pill navigation from Home Map screen', async () => {
    const gpsPillButton = await $(byResourceId('MAIN.gps-pill-btn'));
    await gpsPillButton.click();

    const gpsDetailsScreen = await $(byResourceId('MAIN.gps-details-scrn'));
    await expect(gpsDetailsScreen).toBeDisplayed();

    const gpsText = await $(byTextMatches('Current GPS Location'));
    await expect(gpsText).toBeDisplayed();
  });

  it('should navigate back to the home map screen', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const mapView = await $(byResourceId('MAIN.mapbox-map-view'));
    await expect(mapView).toBeDisplayed();
  });

  it('should verify GPS pill navigation from Camera screen', async () => {
    const cameraTab = await $(byResourceId('tabBarButtonCamera'));
    await cameraTab.click();

    const gpsPillButton = await $(byResourceId('MAIN.gps-pill-btn'));
    await gpsPillButton.click();

    const gpsDetailsScreen = await $(byResourceId('MAIN.gps-details-scrn'));
    await expect(gpsDetailsScreen).toBeDisplayed();
    await expect($(byTextMatches('latitude'))).toBeDisplayed();
  });

  it('should navigate back to the Camera screen', async () => {
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();

    const cameraScreen = await $(byResourceId('MAIN.camera-scrn'));
    await expect(cameraScreen).toBeDisplayed();
  });
});
