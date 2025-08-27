import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Settings - About CoMapeo Flow', () => {
  it('should open About CoMapeo from the drawer', async () => {
    const mapTab = await $('~Go to map.');
    await mapTab.click();
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const aboutComapeoOption = await $('~Go to about CoMapeo screen.');
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
    await expect($(byTextMatches('Emojis source'))).toBeDisplayed();
    await expect($(byTextMatches('Release name'))).toBeDisplayed();
  });

  it('should navigate back to map screen', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Close Menu').click();

    await expect($(byResourceId('MAIN.mapbox-map-view'))).toBeDisplayed();
  });
});
