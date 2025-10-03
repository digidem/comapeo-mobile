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
    const earlyAccessItem = await $(byResourceId('earlyAccessFlag'));
    await expect($(byTextMatches('Early Access is OFF'))).toBeDisplayed();
    await earlyAccessItem.click();
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
    await expect($(byTextMatches('Share it here'))).toBeDisplayed();
  });

  it('should show ON in the App Settings list item text', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await expect($(byTextMatches('Early Access is ON'))).toBeDisplayed();
    const earlyAccessItem = await $(byResourceId('earlyAccessFlag'));
    await earlyAccessItem.click();
    await expect($(byResourceId('EA.checkbox-on'))).toBeDisplayed();
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
    await expect($(byTextMatches('Early Access is OFF'))).toBeDisplayed();
    await backBtn.click();
    await $('~Close Menu').click();
  });
});
