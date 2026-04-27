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

    await expect($(byTextMatches('CoMapeo Settings'))).toBeDisplayed();
  });

  it('should re-open Unit System and switch back to Metric', async () => {
    const unitSystemOption = await $(byTextMatches('Unit System'));
    await unitSystemOption.click();

    const imperialButton = await $(byResourceId('imperialButton-selected'));
    await expect(imperialButton).toBeDisplayed();

    const metricOption = await $(byTextMatches('Metric'));
    await metricOption.click();

    await expect($(byTextMatches('CoMapeo Settings'))).toBeDisplayed();
  });

  it('should navigate back to the map', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    await $(byResourceId('MAIN.map-screen')).click();
    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
