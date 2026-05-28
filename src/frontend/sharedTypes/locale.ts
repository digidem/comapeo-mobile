import * as v from 'valibot';

import {AvailableLanguageTag} from '../lib/intl';

import LANGUAGES from '../languages.json';
import MESSAGES from '../../../translations/messages.json';

type LegacySupportedLanguageTag = keyof typeof LANGUAGES;

function isSupportedLanguageTag(
  value: string,
): value is LegacySupportedLanguageTag {
  return value in LANGUAGES;
}

export const LocaleStateSchemaV0 = v.variant('languageTag', [
  v.object({
    languageTag: v.null(),
    useSystemPreferences: v.literal(true),
  }),
  v.object({
    languageTag: v.pipe(
      v.string(),
      v.transform((value): LegacySupportedLanguageTag => {
        if (!isSupportedLanguageTag(value)) {
          throw new Error(`Value is not a supported language tag: ${value}`);
        }
        return value;
      }),
    ),
    useSystemPreferences: v.literal(false),
  }),
]);

// Do not change! Bump version in LocaleStoreContext when modifying this schema.
export const LocaleStateSchema = v.object({
  languageTag: v.picklist(
    Object.keys(MESSAGES) as [AvailableLanguageTag, ...AvailableLanguageTag[]],
  ),
  useSystemPreferences: v.boolean(),
});

export type LocaleState = v.InferOutput<typeof LocaleStateSchema>;
