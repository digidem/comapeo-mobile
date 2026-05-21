import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Settings - Language Settings Flow', () => {
  it('should open the Language list from App Settings', async () => {
    const drawerIcon = await $('~Open Menu');
    await drawerIcon.click();

    const appSettingsOption = await $('~Go to app settings screen.');
    await appSettingsOption.click();

    const languageOption = await $(byResourceId('languageSettingsButton'));
    await languageOption.click();
  });

  it('should have "Follow system preferences" option initially selected', async () => {
    const followSystemPreferences = await $(
      byTextMatches('Follow system preferences'),
    );
    await expect(followSystemPreferences).toBeDisplayed();
    await expect($(byResourceId('SystemPreferenceRadioButton'))).toBeChecked();
    // Assumes browserstack uses english as system pref
    await expect($(byResourceId('currentLanguageLabel'))).toHaveText('English');
  });

  it('should scroll to Spanish, select it, and confirm language change', async () => {
    await $(byTextMatches('Español')).scrollIntoView();
    await $(byTextMatches('Español')).click();

    // header should change
    const idiomaHeader = await $(byTextMatches('Idioma'));
    await expect(idiomaHeader).toBeDisplayed();

    await expect($(byResourceId('esRadioButton'))).toBeChecked();
    const languageHeader = $(
      'android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("currentLanguageLabel"))',
    );
    await expect(languageHeader).toHaveText('Español');

    await $(byResourceId('MAIN.header-back-btn')).click();
    await $(byResourceId('MAIN.header-back-btn')).click();
    await $(byResourceId('MAIN.map-screen')).click();
    const obsListTab = await $('~Go to observations list.');
    await obsListTab.click();

    await expect($(byText('Añadir observaciones'))).toBeDisplayed();
    await $('~Go to map.').click();
  });

  it('should switch back to English and confirm language revert', async () => {
    const drawerIcon = await $(byResourceId('HOME.header-button'));
    if (await drawerIcon.isDisplayed()) {
      await drawerIcon.click();
    }

    const settingsInSpanish = $(byTextMatches('Ajustes de'));
    await settingsInSpanish.click();

    const spanishLanguageOption = await $(byTextMatches('Español'));
    await spanishLanguageOption.click();
    const englishElem = await $(byTextMatches('English'));
    await englishElem.click();

    await expect($(byResourceId('currentLanguageLabel'))).toHaveText('English');
    await $(byResourceId('MAIN.header-back-btn')).click();
    await $(byResourceId('MAIN.header-back-btn')).click();
    await $(byResourceId('MAIN.map-screen')).click();
  });
});
