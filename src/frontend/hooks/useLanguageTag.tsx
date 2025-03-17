import {useMemo} from 'react';
import {useLocales} from 'expo-localization';

import {
  type Settings,
  useSettingsState,
} from '../contexts/SettingsStoreContext';
import {resolveLanguageTag} from '../lib/intl';

function selector(state: Settings): string | null {
  return state.locale ? state.locale.languageTag : null;
}

/**
 * Resolves the language tag based on the settings and system preferences. See [`resolveLanguageTag()`](../../lib/intl.ts) for more details.
 */
export function useLanguageTag() {
  const systemPreferredLocales = useLocales();
  const selectedLanguageTag = useSettingsState(selector);

  return useMemo(() => {
    return resolveLanguageTag({
      selected: selectedLanguageTag,
      systemPreferred: systemPreferredLocales.map(l => l.languageTag),
    });
  }, [systemPreferredLocales, selectedLanguageTag]);
}
