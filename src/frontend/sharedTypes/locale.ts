import * as v from 'valibot';

import {isSupportedLanguageTag, SupportedLanguageTag} from '../lib/intl';

// Do not change! Bump version in LocaleStoreContext when modifying this schema.
export const LocaleStateSchema = v.variant('languageTag', [
  v.object({
    languageTag: v.null(),
    useSystemPreferences: v.literal(true),
  }),
  v.object({
    languageTag: v.pipe(
      v.string(),
      v.transform((value): SupportedLanguageTag => {
        if (!isSupportedLanguageTag(value)) {
          throw new Error(`Value is not a supported language tag: ${value}`);
        }
        return value;
      }),
    ),
    useSystemPreferences: v.literal(false),
  }),
]);

export type LocaleState = v.InferOutput<typeof LocaleStateSchema>;
