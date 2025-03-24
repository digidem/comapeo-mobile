import {useLocales} from 'expo-localization';
import {useMemo} from 'react';

import {useLocaleState} from '../contexts/LocaleStoreContext';
import {getAppLanguageTag} from '../lib/intl';

export function useAppLanguageTag() {
  const systemLocales = useLocales();
  const localeState = useLocaleState();

  return useMemo(() => {
    return getAppLanguageTag({
      localeState,
      systemLanguageTags: systemLocales.map(l => l.languageTag),
    });
  }, [localeState, systemLocales]);
}
