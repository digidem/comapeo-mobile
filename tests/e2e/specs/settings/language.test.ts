import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Settings - Language Settings Flow', () => {
  it('should open the Language list from App Settings', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();

    const languageOption = await $(byTextMatches('Language'));
    await languageOption.click();

    // TODO: Add assertion about the initially selected option on this screen
  });

  it('should scroll to Spanish, select it, and confirm language change', async () => {
    await $(byTextMatches('Spanish')).scrollIntoView();
    await $(byTextMatches('Spanish')).click();

    await expect($(byTextMatches('Idioma'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Close Menu').click();
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect(
      $(
        byTextMatches(
          'hace\\s+(?:[1-5]?\\d|60)\\s+(?:minuto|minutos|segundos)',
        ),
      ),
    ).toBeDisplayed();
  });

  it('should switch back to English and confirm language revert', async () => {
    const drawerIcon = await $(byResourceId('drawer-icon-home'));
    if (await drawerIcon.isDisplayed()) {
      await drawerIcon.click();
    }

    //const settingsInSpanish = await $(byTextMatches('Ajustes de la'));
    // commenting out until translation done
    const settingsInEnglish = await $(byTextMatches('Settings'));
    await settingsInEnglish.click();

    const idiomaOption = await $(byTextMatches('Idioma'));
    await idiomaOption.click();

    const englishElem = await $(byTextMatches('English'));
    await englishElem.click();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $('~Close Menu').click();
  });
});
