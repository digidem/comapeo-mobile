import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byTextMatches} from '../../utils/selectors';

describe('Language Settings Flow', () => {
  it('should open the Language list from App Settings', async () => {
    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to App Settings');
    await appSettingsOption.click();

    const languageOption = await $(byTextMatches('Language'));
    await languageOption.click();
  });

  it('should scroll to Spanish, select it, and confirm language change', async () => {
    const spanishElem = await $(byTextMatches('Spanish'));
    await $(byTextMatches('Spanish')).scrollIntoView();
    await spanishElem.click();

    await expect($(byTextMatches('Idioma'))).toBeDisplayed();

    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    const obsListTab = await $('~Go to ObservationsList');
    await obsListTab.click();

    await expect($(byTextMatches('Observaciones'))).toBeDisplayed();
  });

  it('should switch back to English and confirm language revert', async () => {
    const backBtn = await $(byResourceId('MAIN.header-back-btn'));
    await backBtn.click();

    const drawerIcon = await $('~Open Navigation Drawer');
    await drawerIcon.click();

    const settingsInSpanish = await $(byTextMatches('Ajustes de la'));
    await settingsInSpanish.click();

    const idiomaOption = await $(byTextMatches('Idioma'));
    await idiomaOption.click();

    const englishElem = await $(byTextMatches('English'));
    await englishElem.click();

    await backBtn.click();
  });
});
