// Mapping of language tags to corresponding translated messages used in app
import MESSAGES from '../../../translations/messages.json';
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
    // Commenting this out for now. Categories can be translated independently of this app/crowdin.
    // The user might need translate the categories (which is done via this language code).
    // So we need to make sure the user has access to languages even if there are no translations
    // Previously we dealt with this by adding 1 translation to an appropriate language.
    // We may still want to do that, but we intentionally took out any wrong translations.
    // "api" had several portuguese translation, and I know understand that those
    // "portuguese translation" were just for adding it onto the list of available languages,
    // in order for users to translate there categories. Since we took out those translations
    // commenting out this code allows for it to still show up in the app without adding "translations"

    // const hasAtLeastOneTranslatedString =
    //   Object.keys(MESSAGES[languageTag]).length > 0;

    // if (!hasAtLeastOneTranslatedString) continue;

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

/**
 * Resolves a language tag from a list of system-preferred language tags.
 * Falls back to `'en'` if no supported tag can be found.
 *
 * @param systemLanguageTags Ordered list of language tags from system preferences (most preferred first)
 * @returns A resolved SupportedLanguageTag
 */
export function getUsableLanguageTagFromSystemPreferences(
  systemLanguageTags: Array<string>,
): SupportedLanguageTag {
  for (const t of systemLanguageTags) {
    const usable = getUsableLanguageTag(t);
    if (usable) return usable;
  }
  return 'en';
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
