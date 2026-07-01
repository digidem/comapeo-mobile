// Mapping of language tag to corresponding native and english names
import LANGUAGES from '../languages.json';
import {LocaleConfig} from 'react-native-calendars';
import {defineMessages} from 'react-intl';
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

// An arbitrary Sunday, used as the start of the reference week for deriving day names.
const REFERENCE_SUNDAY = new Date(2024, 0, 7);

function getMonthNames(languageTag: string, format: 'long' | 'short') {
  const formatter = new Intl.DateTimeFormat(languageTag, {month: format});
  return Array.from({length: 12}, (_, month) =>
    formatter.format(new Date(2024, month, 1)),
  );
}

function getDayNames(languageTag: string, format: 'long' | 'short') {
  const formatter = new Intl.DateTimeFormat(languageTag, {weekday: format});
  return Array.from({length: 7}, (_, dayOffset) => {
    const date = new Date(REFERENCE_SUNDAY);
    date.setDate(date.getDate() + dayOffset);
    return formatter.format(date);
  });
}

// `Intl` has no CLDR data for some of our supported languages (e.g. Indigenous
// languages not covered by ICU), and silently falls back to English names for
// them. These messages let translators supply month/day names through the
// normal translation pipeline for languages `Intl` can't cover.
const calendarMessages = defineMessages({
  january: {
    id: 'lib.intl.calendarMonth.january',
    defaultMessage: 'January',
    description:
      'This is automatically translated for most languages and should only be translated to ',
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
  // react-native-calendars also needs full day names: it builds each day
  // cell's accessibility label from a format string that includes `dddd`.
  sundayFull: {id: 'lib.intl.calendarDay.sunday', defaultMessage: 'Sunday'},
  mondayFull: {id: 'lib.intl.calendarDay.monday', defaultMessage: 'Monday'},
  tuesdayFull: {
    id: 'lib.intl.calendarDay.tuesday',
    defaultMessage: 'Tuesday',
  },
  wednesdayFull: {
    id: 'lib.intl.calendarDay.wednesday',
    defaultMessage: 'Wednesday',
  },
  thursdayFull: {
    id: 'lib.intl.calendarDay.thursday',
    defaultMessage: 'Thursday',
  },
  fridayFull: {id: 'lib.intl.calendarDay.friday', defaultMessage: 'Friday'},
  saturdayFull: {
    id: 'lib.intl.calendarDay.saturday',
    defaultMessage: 'Saturday',
  },
});

const CALENDAR_MONTH_MESSAGE_ORDER = [
  calendarMessages.january,
  calendarMessages.february,
  calendarMessages.march,
  calendarMessages.april,
  calendarMessages.may,
  calendarMessages.june,
  calendarMessages.july,
  calendarMessages.august,
  calendarMessages.september,
  calendarMessages.october,
  calendarMessages.november,
  calendarMessages.december,
];

// Ordered Sunday-first to match react-native-calendars' day index convention.
const CALENDAR_DAY_SHORT_MESSAGE_ORDER = [
  calendarMessages.sunday,
  calendarMessages.monday,
  calendarMessages.tuesday,
  calendarMessages.wednesday,
  calendarMessages.thursday,
  calendarMessages.friday,
  calendarMessages.saturday,
];

const CALENDAR_DAY_MESSAGE_ORDER = [
  calendarMessages.sundayFull,
  calendarMessages.mondayFull,
  calendarMessages.tuesdayFull,
  calendarMessages.wednesdayFull,
  calendarMessages.thursdayFull,
  calendarMessages.fridayFull,
  calendarMessages.saturdayFull,
];

/**
 * Registers month and day names for `languageTag` with `react-native-calendars`.
 * Prefers a translated message where one exists, and otherwise falls back to
 * the same `Intl` API react-intl's `formatDate` uses, so most languages need
 * no translation effort at all.
 */
export function configureCalendarLocale(languageTag: AvailableLanguageTag) {
  const translated: Record<string, string> = MESSAGES[languageTag] || {};
  const fallbackMonthNames = getMonthNames(languageTag, 'long');
  const fallbackDayNames = getDayNames(languageTag, 'long');
  const fallbackDayNamesShort = getDayNames(languageTag, 'short');

  LocaleConfig.locales[languageTag] = {
    monthNames: CALENDAR_MONTH_MESSAGE_ORDER.map(
      (message, i) => translated[message.id] ?? fallbackMonthNames[i],
    ),
    dayNames: CALENDAR_DAY_MESSAGE_ORDER.map(
      (message, i) => translated[message.id] ?? fallbackDayNames[i],
    ),
    dayNamesShort: CALENDAR_DAY_SHORT_MESSAGE_ORDER.map(
      (message, i) => translated[message.id] ?? fallbackDayNamesShort[i],
    ),
  };
  LocaleConfig.defaultLocale = languageTag;
}
