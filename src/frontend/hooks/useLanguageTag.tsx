import {useMemo} from 'react';
import {useLocales} from 'expo-localization';

import {useSettingsState} from '../contexts/SettingsStoreContext';
import {resolveLanguageTag} from '../lib/intl';

/**
 * Resolves the language tag based on the settings and system preferences. See [`resolveLanguageTag()`](../../lib/intl.ts) for more details.
 */
export function useLanguageTag() {
  const systemPreferredLocales = useLocales();
  const localeSetting = useSettingsState(state => state.locale);

  return useMemo(() => {
    return resolveLanguageTag(
      localeSetting === 'system'
        ? {
            from: 'system',
            languageTags: systemPreferredLocales.map(l => l.languageTag),
          }
        : {from: 'selected', languageTags: [localeSetting.languageTag]},
    );
  }, [systemPreferredLocales, localeSetting]);
}
