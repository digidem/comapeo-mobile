import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';
import {checkForElementGone} from '../../utils/checkForGone';

describe('Settings - Early Access Mode', () => {
  it('should show Early Access off and open Early Access from App Settings', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();
    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();
    await $(byResourceId('earlyAccessFlagLabel')).scrollIntoView();
    await expect($(byTextMatches('Early Access OFF'))).toBeDisplayed();
    await $(byResourceId('earlyAccessFlag')).click();
    await expect($(byTextMatches('Early Access Mode'))).toBeDisplayed();
    await expect($(byText('See CoMapeo Updates'))).toBeDisplayed();
  });

  it('should toggle ON and check info box + feedback row is present', async () => {
    const offCheckbox = await $(byResourceId('EA.checkbox-off'));
    await offCheckbox.click();
    await expect($(byResourceId('EA.checkbox-on'))).toBeDisplayed();
    await expect(
      $(
        byTextMatches(
          "Data from Early Access won't be visible to collaborators who haven't opted in.",
        ),
      ),
    ).toBeDisplayed();
    await expect($(byTextMatches('Have feedback?'))).toBeDisplayed();
    await expect($(byTextMatches('Share it at'))).toBeDisplayed();
  });

  it('should show ON in the App Settings list item text', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $(byResourceId('earlyAccessFlagLabel')).scrollIntoView();
    await expect($(byTextMatches('Early Access ON'))).toBeDisplayed();
    await $(byResourceId('earlyAccessFlag')).click();
    await expect($(byResourceId('EA.checkbox-on'))).toBeDisplayed();
  });

  it('should show banner and label on other screens', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    const backBtnAgain = await $(byResourceId('MAIN.header-back-btn'));
    await backBtnAgain.click();
    await expect($(byTextMatches('Early Access ON'))).toBeDisplayed();
    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();
    const aboutComapeoOption = await $(byResourceId('aboutSettingsButton'));
    await aboutComapeoOption.scrollIntoView();
    await aboutComapeoOption.click();
    await expect(
      $(byTextMatches('You are in Early Access Mode.')),
    ).toBeDisplayed();
    const seeUpdates = await $(byTextMatches('See CoMapeo Updates'));
    await seeUpdates.scrollIntoView();
    await expect(seeUpdates).toBeDisplayed();
    await $(byResourceId('MAIN.header-back-btn')).click();
    await $(byResourceId('earlyAccessFlagLabel')).scrollIntoView();
    await $(byResourceId('earlyAccessFlag')).click();
  });

  it('should toggle OFF, show bottom sheet, close it, and show OFF in App Settings', async () => {
    const onCheckbox = await $(byResourceId('EA.checkbox-on'));
    await onCheckbox.click();
    const offSheet = await $(byResourceId('EA.turned-off-sheet'));
    await expect(offSheet).toBeDisplayed();
    const closeBtn = await $(byText('Close'));
    await closeBtn.click();
    await checkForElementGone(byResourceId('EA.turned-off-sheet'));
    await expect($(byResourceId('EA.checkbox-off'))).toBeDisplayed();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $(byResourceId('earlyAccessFlagLabel')).scrollIntoView();
    await expect($(byTextMatches('Early Access OFF'))).toBeDisplayed();
    await backBtn.click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
