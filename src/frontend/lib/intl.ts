import MESSAGES from '../../../translations/messages.json';
import LANGUAGES from '../languages.json';

export type TranslatedLocale = keyof typeof MESSAGES;
type SupportedLanguageLocale = keyof typeof LANGUAGES;

interface Language {
  /** IETF BCP 47 langauge tag with region code. */
  locale: SupportedLanguageLocale;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

export const SUPPORTED_LANGUAGES = deriveSupportedLanguages(
  Object.keys(MESSAGES) as Array<TranslatedLocale>,
);

function deriveSupportedLanguages(
  translatedLocales: Array<TranslatedLocale>,
): Array<Language> {
  const result: Array<Language> = [];

  for (const locale of translatedLocales) {
    const hasAtLeastOneTranslatedString =
      Object.keys(MESSAGES[locale]).length > 0;

    if (!hasAtLeastOneTranslatedString) continue;

    if (!isSupportedLanguageLocale(locale)) {
      if (process.env.EXPO_PUBLIC_APP_VARIANT === 'development') {
        console.warn(
          `Locale "${locale}" is not available in CoMapeo (see \`src/frontend/languages.json\`)`,
        );
      }
      continue;
    }

    result.push({locale, ...LANGUAGES[locale]});
  }

  result.sort((a, b) => {
    return a.englishName.localeCompare(b.englishName);
  });

  return result;
}

function isSupportedLanguageLocale(
  locale: string,
): locale is SupportedLanguageLocale {
  return locale in LANGUAGES;
}

// Device locale can be regional e.g. `en-US` but we might only have
// translations for `en`. If we don't have translations for a given device
// language, then we ignore it and fallback to `en` or the user selected
// language for the app
export function getSupportedLocale(
  locale: string,
): SupportedLanguageLocale | undefined {
  if (SUPPORTED_LANGUAGES.find(lang => lang.locale === locale))
    return locale as SupportedLanguageLocale;

  const nonRegionalLocale = locale.split('-')[0];

  if (SUPPORTED_LANGUAGES.find(lang => lang.locale === nonRegionalLocale))
    return nonRegionalLocale as SupportedLanguageLocale;
}
