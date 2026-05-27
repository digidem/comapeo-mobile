// Mapping of language tags to corresponding translated messages used in app
import MESSAGES from '../../../translations/messages.json';
// Mapping of language tag to corresponding native and english names
import LANGUAGES from '../languages.json';

interface UsableLanguage {
  /** IETF BCP 47 language tag (https://en.wikipedia.org/wiki/IETF_language_tag) */
  languageTag: TranslatedLanguageTag;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

// Language tag that has corresponding translations
export type TranslatedLanguageTag = keyof typeof MESSAGES;

// All supported languages
export const USABLE_LANGUAGES = getUsableLanguages(
  Object.keys(MESSAGES) as Array<TranslatedLanguageTag>,
);

/**
 * Resolves a language tag from a list of system-preferred language tags.
 * Falls back to `'en'` if no supported tag can be found.
 *
 * @param systemLanguageTags Ordered list of language tags from system preferences (most preferred first)
 * @returns A resolved SupportedLanguageTag
 */
export function getUsableLanguageTagFromSystemPreferences(
  systemLanguageTags: Array<string>,
): TranslatedLanguageTag {
  for (const t of systemLanguageTags) {
    const usable = getUsableLanguageTag(t);
    if (usable) return usable;
  }
  return 'en';
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
export function getUsableLanguageTag(languageTag: string) {
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

/**
 * @param translatedLanguageTags List of language tags that may have translated messages
 * @returns List of languages that are usable within the app (see {@link UsableLanguage})
 */
function getUsableLanguages(
  translatedLanguageTags: Array<TranslatedLanguageTag>,
): Array<UsableLanguage> {
  const result: Array<UsableLanguage> = [];

  for (const languageTag of translatedLanguageTags) {
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

/**
 * Really naïve function to get the language code component of a IETF BCP 47 language tag
 *
 * @param languageTag Language tag
 * @returns Language code
 */
function extractLanguageCode(languageTag: string): string {
  // The language code is always the first component of a the language tag
  // (https://en.wikipedia.org/wiki/IETF_language_tag#Syntax_of_language_tags)
  return languageTag.split('-')[0]!;
}
