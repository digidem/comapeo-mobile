import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Settings - Unit System Flow', () => {
  it('should open the App Settings from the drawer', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();
  });

  it('should open Unit System screen', async () => {
    const unitSystemOption = await $(byTextMatches('Unit System'));
    await unitSystemOption.click();

    await expect($(byTextMatches('Metric'))).toBeDisplayed();
    await expect($(byTextMatches('Imperial'))).toBeDisplayed();
  });

  it('should select Imperial and return to settings', async () => {
    const imperialOption = await $(byTextMatches('Imperial'));
    await imperialOption.click();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await expect($(byTextMatches('CoMapeo Settings'))).toBeDisplayed();
  });

  it('should display feet abbreviation on the GPS pill on the map', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $(byResourceId('MAIN.map-screen')).click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
    await expect($(byTextMatches('±\\d+ ft'))).toBeDisplayed();
  });

  it('should display imperial units within the GPS information screen', async () => {
    await $(byResourceId('MAP.gps-pill')).click();
    await expect($(byResourceId('MAIN.gps-details-scrn'))).toBeDisplayed();
    await expect($(byTextMatches('\\d+(\\.\\d+)? ft'))).toBeDisplayed();
    await expect($(byTextMatches('\\d+\\.\\d+ ft/s'))).toBeDisplayed();
  });

  it('should switch back to Metric via settings', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();

    const unitSystemOption = await $(byTextMatches('Unit System'));
    await unitSystemOption.click();

    const imperialButton = await $(byResourceId('imperialButton-selected'));
    await expect(imperialButton).toBeDisplayed();

    const metricOption = await $(byTextMatches('Metric'));
    await metricOption.click();
    await $(byResourceId('MAIN.header-back-btn')).click();
    await expect($(byTextMatches('CoMapeo Settings'))).toBeDisplayed();
  });

  it('should display meters on the GPS pill after switching to Metric', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await $(byResourceId('MAIN.map-screen')).click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
    await expect($(byTextMatches('±\\d+ m'))).toBeDisplayed();
  });

  it('should display metric units within the GPS information screen', async () => {
    await $(byResourceId('MAP.gps-pill')).click();
    await expect($(byResourceId('MAIN.gps-details-scrn'))).toBeDisplayed();
    await expect($(byTextMatches('\\d+(\\.\\d+)? m'))).toBeDisplayed();
    await expect($(byTextMatches('\\d+\\.\\d+ m/s'))).toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
  });
});
