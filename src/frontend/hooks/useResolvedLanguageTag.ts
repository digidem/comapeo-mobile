import {useMemo} from 'react';
import {useLocales} from 'expo-localization';

import {useSelectedLocaleState} from '../contexts/SelectedLocaleContext';
import {resolveLanguageTag} from '../lib/intl';

export function useResolvedLanguageTag() {
  const systemPreferredLocales = useLocales();
  const selectedLanguageTag = useSelectedLocaleState(
    state => state.languageTag,
  );

  return useMemo(() => {
    return resolveLanguageTag({
      selected: selectedLanguageTag,
      systemPreferred: systemPreferredLocales.map(l => l.languageTag),
    });
  }, [systemPreferredLocales, selectedLanguageTag]);
}
