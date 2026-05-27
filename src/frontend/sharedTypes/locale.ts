import * as v from 'valibot';

import {TranslatedLanguageTag} from '../lib/intl';

// Do not change! Bump version in LocaleStoreContext when modifying this schema.
export const LocaleStateSchema = v.object({
  languageTag: v.pipe(
    v.string(),
    v.transform(value => value as TranslatedLanguageTag),
  ),
  useSystemPreferences: v.boolean(),
});

export type LocaleState = v.InferOutput<typeof LocaleStateSchema>;
