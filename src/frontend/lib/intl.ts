// Mapping of language tags to corresponding translated messages used in app
import MESSAGES from '../../../translations/messages.json';
import {LocaleState} from '../contexts/LocaleStoreContext';
// Mapping of language tag to corresponding native and english names
import LANGUAGES from '../languages.json';

// Language tag that has corresponding translations
export type TranslatedLanguageTag = keyof typeof MESSAGES;
// Language tag that the app claims to support
export type SupportedLanguageTag = keyof typeof LANGUAGES;

// A subset of supported languages that have at least one translated message
export const USABLE_LANGUAGES = getUsableLanguages(
  Object.keys(MESSAGES) as Array<TranslatedLanguageTag>,
);

interface UsableLanguage {
  /** IETF BCP 47 language tag (https://en.wikipedia.org/wiki/IETF_language_tag) */
  languageTag: SupportedLanguageTag;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

/**
 * Gets the languages that are usable within the app, meaning:
 *
 * 1. They have at least one translated string
 * 2. They match a language that is found in the [supported languages file](../languages.json)
 *
 * @param translatedLanguageTags List of language tags that may have translated messages
 * @returns List of languages that are usable within the app (see {@link UsableLanguage})
 */
function getUsableLanguages(
  translatedLanguageTags: Array<TranslatedLanguageTag>,
): Array<UsableLanguage> {
  const result: Array<UsableLanguage> = [];

  for (const languageTag of translatedLanguageTags) {
    const hasAtLeastOneTranslatedString =
      Object.keys(MESSAGES[languageTag]).length > 0;

    if (!hasAtLeastOneTranslatedString) continue;

    if (!isSupportedLanguageTag(languageTag)) {
      if (
        process.env.APP_VARIANT === 'development' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console.warn(
          `Language "${languageTag}" is not available in CoMapeo (see \`src/frontend/languages.json\`)`,
        );
      }
      continue;
    }

    const {englishName, nativeName} = LANGUAGES[languageTag];

    result.push({
      englishName,
      languageTag,
      nativeName,
    });
  }

  result.sort((a, b) => {
    return a.englishName.localeCompare(b.englishName);
  });

  return result;
}

export function isSupportedLanguageTag(
  value: string,
): value is SupportedLanguageTag {
  return value in LANGUAGES;
}

/**
 * Returns the variant of a language tag that the app can use to show translated messages.
 * If we have translations that match the primary language code component of a specified language tag,
 * we return the language code as the language tag (since all language codes are valid language tags).
 *
 * Example: if the language tag is `'en-GB'` but we only have translations for `'en'`, then `'en'` is returned.
 *
 * @param languageTag Language tag
 * @returns The usable language tag
 */
function getUsableLanguageTag(languageTag: string) {
  for (const supported of USABLE_LANGUAGES) {
    // Check if the language tag has a matching language tag that we support
    if (languageTag === supported.languageTag) {
      return supported.languageTag;
    }

    // Check if the language code component of the language tag has a matching language code that we support
    const languageCode = extractLanguageCode(languageTag);

    if (languageCode === supported.languageTag) {
      return supported.languageTag;
    }
  }
}

type ResolvedLanguageTag = {
  // Where the `value` comes from. Not really used in the app (yet),
  // but it's useful for understanding the resolution implementation and for debugging purposes.
  source: 'fallback' | 'system' | 'selected';
  value: SupportedLanguageTag;
};

/**
 * Determines the language tag that the app should use based on what is supported.
 * If no supported value can be determined, falls back to using `'en'` as the resolved language tag value.
 *
 * If a language has explicitly been selected, returns that value. If following system preferences, tries to find a supported value.
 * If no supported language tag can be determined from the system settings, falls back to using `'en'`.
 *
 * @returns The resolved language tag. `source` represents where the tag comes from and `value` represents the actual tag string
 */
export function getAppLanguageTag({
  localeState,
  systemLanguageTags,
}: {
  localeState: LocaleState;
  systemLanguageTags: Array<string>;
}): ResolvedLanguageTag {
  if (!localeState.useSystemPreferences) {
    return {
      source: 'selected',
      value: localeState.languageTag,
    };
  }

  for (const t of systemLanguageTags) {
    const usableSystemLanguageTag = getUsableLanguageTag(t);

    if (usableSystemLanguageTag) {
      return {source: 'system', value: usableSystemLanguageTag};
    }
  }

  return {source: 'fallback', value: 'en'};
}

/**
 * Really naïve function to get the language code component of a IETF BCP 47 language tag
 *
 * @param languageTag Language tag
 * @returns Language code
 */
export function extractLanguageCode(languageTag: string): string {
  // The language code is always the first component of a the language tag
  // (https://en.wikipedia.org/wiki/IETF_language_tag#Syntax_of_language_tags)
  return languageTag.split('-')[0]!;
}
