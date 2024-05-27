import messages from '../../../translations/messages.json';
import languages from '../languages.json';

export type TranslatedLocale = keyof typeof messages;
export type SupportedLanguageLocale = keyof typeof languages;

export interface LanguageName {
  /** IETF BCP 47 langauge tag with region code. */
  locale: SupportedLanguageLocale;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

const translatedLocales = Object.keys(messages) as Array<TranslatedLocale>;

export const supportedLanguages: LanguageName[] = translatedLocales
  .filter(translatedLocale => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[translatedLocale]).length > 0;
    // This will show a typescript error if the language name does not exist
    const hasTranslatedLanguageName = languages[translatedLocale];
    if (!hasTranslatedLanguageName) {
      console.warn(
        `Locale "${translatedLocale}" is not available in Mapeo because we do not have
a language name and translations in \`src/frontend/languages.json\``,
      );
    }
    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName;
  })
  .map(translatedLocale => ({
    locale: translatedLocale,
    ...languages[translatedLocale],
  }))
  .sort((a, b) => {
    return a.englishName.localeCompare(b.englishName);
  });

// Device locale can be regional e.g. `en-US` but we might only have
// translations for `en`. If we don't have translations for a given device
// language, then we ignore it and fallback to `en` or the user selected
// language for the app
export function getSupportedLocale(
  locale: string,
): keyof typeof languages | undefined {
  if (supportedLanguages.find(lang => lang.locale === locale))
    return locale as keyof typeof languages;
  const nonRegionalLocale = locale.split('-')[0];
  if (supportedLanguages.find(lang => lang.locale === nonRegionalLocale))
    return nonRegionalLocale as keyof typeof languages;
}
