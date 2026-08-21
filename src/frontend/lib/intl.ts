/* eslint-disable intl/no-unused-message-descriptors */

// Mapping of language tag to corresponding native and english names
import LANGUAGES from '../languages.json';
import {LocaleConfig} from 'react-native-calendars';
import {
  createIntl,
  createIntlCache,
  defineMessages,
  IntlCache,
  type MessageFormatElement,
} from 'react-intl';
import {
  localeImports,
  type AvailableLanguageTag,
} from '../../../translations/index';

export type {AvailableLanguageTag};

interface UsableLanguage {
  /** IETF BCP 47 language tag (https://en.wikipedia.org/wiki/IETF_language_tag) */
  languageTag: AvailableLanguageTag;
  /** Localized name for language */
  nativeName: string;
  /** English name for language */
  englishName: string;
}

// All supported languages
export const USABLE_LANGUAGES = getUsableLanguages(
  Object.keys(localeImports) as Array<AvailableLanguageTag>,
);

/**
 * Resolves a language tag from a list of system-preferred language tags.
 * Falls back to `'en'` if no supported tag can be found.
 *
 * @param systemLanguageTags Ordered list of language tags from system preferences (most preferred first)
 * @returns an AvailableLanguageTag
 */
export function getUsableLanguageTagFromSystemPreferences(
  systemLanguageTags: Array<string>,
): AvailableLanguageTag {
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
  translatedLanguageTags: Array<AvailableLanguageTag>,
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

// `react-intl` has the translations of these be default, but not for all supported languages
// (e.g. Indigenous languages), and silently falls back to English names for
// them. These let translators supply translations through crowdin.
const calendarMonths = defineMessages({
  january: {
    id: 'lib.intl.calendarMonth.january',
    defaultMessage: 'January',
  },
  february: {
    id: 'lib.intl.calendarMonth.february',
    defaultMessage: 'February',
  },
  march: {id: 'lib.intl.calendarMonth.march', defaultMessage: 'March'},
  april: {id: 'lib.intl.calendarMonth.april', defaultMessage: 'April'},
  may: {id: 'lib.intl.calendarMonth.may', defaultMessage: 'May'},
  june: {id: 'lib.intl.calendarMonth.june', defaultMessage: 'June'},
  july: {id: 'lib.intl.calendarMonth.july', defaultMessage: 'July'},
  august: {id: 'lib.intl.calendarMonth.august', defaultMessage: 'August'},
  september: {
    id: 'lib.intl.calendarMonth.september',
    defaultMessage: 'September',
  },
  october: {id: 'lib.intl.calendarMonth.october', defaultMessage: 'October'},
  november: {
    id: 'lib.intl.calendarMonth.november',
    defaultMessage: 'November',
  },
  december: {
    id: 'lib.intl.calendarMonth.december',
    defaultMessage: 'December',
  },
});

const calendarDaysShort = defineMessages({
  sunday: {id: 'lib.intl.calendarDayShort.sunday', defaultMessage: 'Sun'},
  monday: {id: 'lib.intl.calendarDayShort.monday', defaultMessage: 'Mon'},
  tuesday: {id: 'lib.intl.calendarDayShort.tuesday', defaultMessage: 'Tue'},
  wednesday: {
    id: 'lib.intl.calendarDayShort.wednesday',
    defaultMessage: 'Wed',
  },
  thursday: {
    id: 'lib.intl.calendarDayShort.thursday',
    defaultMessage: 'Thu',
  },
  friday: {id: 'lib.intl.calendarDayShort.friday', defaultMessage: 'Fri'},
  saturday: {
    id: 'lib.intl.calendarDayShort.saturday',
    defaultMessage: 'Sat',
  },
});

const calendarDaysLong = defineMessages({
  // react-native-calendars also needs full day names: it builds each day
  // cell's accessibility label from a format string that includes `dddd`.
  sunday: {id: 'lib.intl.calendarDay.sunday', defaultMessage: 'Sunday'},
  monday: {id: 'lib.intl.calendarDay.monday', defaultMessage: 'Monday'},
  tuesday: {
    id: 'lib.intl.calendarDay.tuesday',
    defaultMessage: 'Tuesday',
  },
  wednesday: {
    id: 'lib.intl.calendarDay.wednesday',
    defaultMessage: 'Wednesday',
  },
  thursday: {
    id: 'lib.intl.calendarDay.thursday',
    defaultMessage: 'Thursday',
  },
  friday: {id: 'lib.intl.calendarDay.friday', defaultMessage: 'Friday'},
  saturday: {
    id: 'lib.intl.calendarDay.saturday',
    defaultMessage: 'Saturday',
  },
});

type Month = keyof typeof calendarMonths;
type DayOfWeekShort = keyof typeof calendarDaysShort;
type DayOfWeek = keyof typeof calendarDaysLong;

/**
 *
 * Should be run in a useEffect in order to update on language change
 */
export function configureCalendarLocale({
  translatedMessages,
  languageCodes,
}: {
  translatedMessages: TranslatedMessages;
  languageCodes: AvailableLanguageTag[];
}) {
  const cache = createIntlCache();
  LocaleConfig.locales[languageCodes.join(', ')] = {
    monthNames: (Object.keys(calendarMonths) as Array<Month>).map(month =>
      getMonth({month, translatedMessages, cache}),
    ),
    dayNamesShort: (
      Object.keys(calendarDaysShort) as Array<DayOfWeekShort>
    ).map(day => getShortDay({dayofWeek: day, translatedMessages, cache})),
    dayNames: (Object.keys(calendarDaysLong) as Array<DayOfWeek>).map(day =>
      getLongDay({dayofWeek: day, translatedMessages, cache}),
    ),
  };
  LocaleConfig.defaultLocale = languageCodes.join(', ');
}
type TranslatedMessages = Partial<
  Record<AvailableLanguageTag, Record<string, MessageFormatElement[]>>
>;

/**
 * `getMonth()`, `getShortDay()`, and `getLongDay` creates translations and fallbacks
 * First, it tries to find translations in crowdin for the all available language tags
 * If none of those are available, it uses the translation in react-intl (most dates are already translated by react intl)
 * And then falls back to english if no translations are available
 *
 * We dont just use the translations available by react-intl because it does not support a few of the languages we support
 */

function getMonth({
  month,
  translatedMessages,
  cache,
}: {
  month: Month;
  translatedMessages: TranslatedMessages;
  cache: IntlCache;
}): string {
  for (const [langCode, messages] of Object.entries(translatedMessages)) {
    const translatedMonth = messages[calendarMonths[month].id];

    const intl = createIntl({locale: langCode, messages}, cache);
    if (translatedMonth) {
      return intl.formatMessage(calendarMonths[month]);
    }

    if (Intl.DateTimeFormat.supportedLocalesOf(langCode).length > 0) {
      const monthIndex = Object.keys(calendarMonths).indexOf(month);
      return intl.formatDate(new Date(2024, monthIndex, 1), {
        month: 'long',
      });
    }
  }
  const englishIntl = createIntl({locale: 'en'}, cache);

  return englishIntl.formatMessage(calendarMonths[month]);
}

function getShortDay({
  dayofWeek,
  translatedMessages,
  cache,
}: {
  dayofWeek: DayOfWeekShort;
  translatedMessages: TranslatedMessages;
  cache: IntlCache;
}): string {
  for (const [langCode, messages] of Object.entries(translatedMessages)) {
    const translatedDay = messages[calendarDaysShort[dayofWeek].id];
    const intl = createIntl({locale: langCode, messages}, cache);
    if (translatedDay) {
      return intl.formatMessage(calendarDaysShort[dayofWeek]);
    }

    if (Intl.DateTimeFormat.supportedLocalesOf(langCode).length > 0) {
      const dayIndex = Object.keys(calendarDaysShort).indexOf(dayofWeek);
      // Jan 7, 2024 is a known sunday
      return intl.formatDate(new Date(2024, 0, 7 + dayIndex), {
        weekday: 'short',
      });
    }
  }
  const englishIntl = createIntl({locale: 'en'}, cache);

  return englishIntl.formatMessage(calendarDaysShort[dayofWeek]);
}

function getLongDay({
  dayofWeek,
  translatedMessages,
  cache,
}: {
  dayofWeek: DayOfWeek;
  translatedMessages: TranslatedMessages;
  cache: IntlCache;
}): string {
  for (const [langCode, messages] of Object.entries(translatedMessages)) {
    const translatedDay = messages[calendarDaysLong[dayofWeek].id];

    const intl = createIntl({locale: langCode, messages}, cache);
    if (translatedDay) {
      return intl.formatMessage(calendarDaysLong[dayofWeek]);
    }

    if (Intl.DateTimeFormat.supportedLocalesOf(langCode).length > 0) {
      const dayIndex = Object.keys(calendarDaysLong).indexOf(dayofWeek);
      // Jan 7, 2024 is a known sunday
      return intl.formatDate(new Date(2024, 0, 7 + dayIndex), {
        weekday: 'long',
      });
    }
  }
  const englishIntl = createIntl({locale: 'en'}, cache);

  return englishIntl.formatMessage(calendarDaysLong[dayofWeek]);
}
