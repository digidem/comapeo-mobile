import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Observations - Filter Toggle (Early Access)', () => {
  it('should enable Early Access', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();
    const earlyAccessItem = await $(byResourceId('earlyAccessFlag'));
    await earlyAccessItem.scrollIntoView();
    await earlyAccessItem.click();
    const offCheckbox = await $(byResourceId('EA.checkbox-off'));
    await offCheckbox.click();
    await expect($(byResourceId('EA.checkbox-on'))).toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    const backBtnAgain = await $(byResourceId('MAIN.header-back-btn'));
    await backBtnAgain.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });

  it('should show filter toggle on observations list when Early Access is on', async () => {
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-toggle'))).toBeDisplayed();
  });

  it('should default to All being active and Just You inactive', async () => {
    await expect($(byResourceId('OBS.filter-all-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-mine-inactive'))).toBeDisplayed();
  });

  it('should mark Just You active when tapped', async () => {
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();

    const mineBtn = $(byResourceId('OBS.filter-mine-inactive'));
    await mineBtn.click();

    await expect($(byResourceId('OBS.filter-mine-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-all-inactive'))).toBeDisplayed();

    // Same observations still visible — all were created on this device
    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
  });

  it('should mark All active when tapped and show same observations', async () => {
    const allBtn = $(byResourceId('OBS.filter-all-inactive'));
    await allBtn.click();

    await expect($(byResourceId('OBS.filter-all-active'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-mine-inactive'))).toBeDisplayed();

    await expect($(byTextMatches('Cave'))).toBeDisplayed();
    await expect($(byTextMatches('Tree'))).toBeDisplayed();
    await $('~Go to map.').click();
  });

  it('should disable Early Access and hide the filter toggle', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();
    const earlyAccessItem = await $(byResourceId('earlyAccessFlag'));
    await earlyAccessItem.scrollIntoView();
    await earlyAccessItem.click();
    const onCheckbox = await $(byResourceId('EA.checkbox-on'));
    await onCheckbox.click();
    const offSheet = await $(byResourceId('EA.turned-off-sheet'));
    await expect(offSheet).toBeDisplayed();
    const closeBtn = await $(byText('Close'));
    await closeBtn.click();
    await checkForElementGone(byResourceId('EA.turned-off-sheet'));
    const backButton = await $(byResourceId('MAIN.header-back-btn'));
    await backButton.click();
    const backButtonAgain = await $(byResourceId('MAIN.header-back-btn'));
    await backButtonAgain.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });

  it('should not show filter toggle on observations list when Early Access is off', async () => {
    await $('~Go to observations list.').click();
    await expect($(byResourceId('OBS.list-scrn'))).toBeDisplayed();
    await expect($(byResourceId('OBS.filter-toggle'))).not.toBeDisplayed();
  });
});
