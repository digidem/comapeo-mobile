// Mapping of language tags to corresponding translated messages used in app
import MESSAGES from '../../../translations/messages.json';
// Mapping of language tag to corresponding native and english names
import LANGUAGES from '../languages.json';

// Language that the app can properly present
interface UsableLanguage {
  /** IETF BCP 47 language tag (https://en.wikipedia.org/wiki/IETF_language_tag) */
  languageTag: SupportedLanguageTag;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

export type TranslatedLanguageTag = keyof typeof MESSAGES;
type SupportedLanguageTag = keyof typeof LANGUAGES;

export const USABLE_LANGUAGES = getUsableLanguages(
  Object.keys(MESSAGES) as Array<TranslatedLanguageTag>,
);

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
      if (process.env.APP_VARIANT === 'development') {
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

function isSupportedLanguageTag(value: string): value is SupportedLanguageTag {
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
 * Determines the language tag that the app should use based on what is supported and the following order of preference:
 *
 * 1. The locale that is explicitly selected by the user (e.g. using the in-app language settings).
 * 2. The preferred locales based on system preferences set by the owner of the device.
 * 3. English (`'en'`)
 *
 * @param params.selected The language tag expicitly selected by the user.
 * @param params.systemPreferred List of preferred language tags based on system preferences, in order of highest to lowest preference.
 *
 * @returns The resolved language tag. `source` represents where the tag comes from and `value` represents the actual tag string
 */
export function resolveLanguageTag({
  selected,
  systemPreferred,
}: {
  selected: string | null;
  systemPreferred: Array<string>;
}): {
  source: 'selected' | 'system' | 'fallback';
  value: SupportedLanguageTag;
} {
  // Check if selected language tag is usable
  if (selected) {
    const usableSelectedTag = getUsableLanguageTag(selected);

    if (usableSelectedTag) {
      return {
        source: 'selected',
        value: usableSelectedTag,
      };
    }
  }

  // Check if any of the system preferred languages are usable
  for (const t of systemPreferred) {
    const usableSystemPreferredTag = getUsableLanguageTag(t);

    if (usableSystemPreferredTag) {
      return {
        source: 'system',
        value: usableSystemPreferredTag,
      };
    }
  }

  // Fall back to English otherwise
  return {
    source: 'fallback',
    value: 'en',
  };
}

export function isTranslatedLanguageTag(
  value: string,
): value is TranslatedLanguageTag {
  return value in MESSAGES;
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
