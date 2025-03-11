import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('About CoMapeo Flow', () => {
  it('should open About CoMapeo from the drawer', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const aboutComapeoOption = await $('~Go to About CoMapeo Screen');
    await aboutComapeoOption.click();
  });

  it('should display version/build/variant and phone info', async () => {
    await expect($(byTextMatches('About CoMapeo'))).toBeDisplayed();

    await expect($(byTextMatches('CoMapeo version'))).toBeDisplayed();
    await expect($(byTextMatches('CoMapeo build'))).toBeDisplayed();
    await expect($(byTextMatches('CoMapeo variant'))).toBeDisplayed();
    await expect($(byTextMatches('Android version'))).toBeDisplayed();
    await expect($(byTextMatches('Android build number'))).toBeDisplayed();
    await expect($(byTextMatches('Phone model'))).toBeDisplayed();
  });

  it('should navigate back to map screen', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Close Navigation Drawer').click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
