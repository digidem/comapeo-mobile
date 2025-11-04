import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Settings - Language Settings Flow', () => {
  it('should open the Language list from App Settings', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();

    const languageOption = await $(byTextMatches('Language'));
    await languageOption.click();
  });

  it('should have "Follow system preferences" option initially selected', async () => {
    const followSystemPreferences = await $(
      byTextMatches('Follow system preferences'),
    );
    await expect(followSystemPreferences).toBeDisplayed();
    await expect($(byResourceId('nullButton-selected'))).toBeDisplayed();
  });

  it('should scroll to Spanish, select it, and confirm language change', async () => {
    await $(byTextMatches('Spanish')).scrollIntoView();
    await $(byTextMatches('Spanish')).click();

    const idiomaOption = await $(byTextMatches('Idioma'));
    await expect(idiomaOption).toBeDisplayed();
    await idiomaOption.click();
    await $(byTextMatches('Español')).scrollIntoView();
    await expect($(byResourceId('esButton-selected'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await backBtn.click();
    await $(byResourceId('MAIN.map-screen')).click();
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect($(byText('Añadir observaciones'))).toBeDisplayed();
  });

  it('should switch back to English and confirm language revert', async () => {
    const drawerIcon = await $(byResourceId('HOME.header-button'));
    if (await drawerIcon.isDisplayed()) {
      await drawerIcon.click();
    }

    const settingsInSpanish = $(byTextMatches('Ajustes de'));
    await settingsInSpanish.click();

    const idiomaOption = await $(byTextMatches('Idioma'));
    await idiomaOption.click();
    const englishElem = await $(byTextMatches('English'));
    await englishElem.click();
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();
    await $(byResourceId('observationsEmptyView')).click();
  });
});
