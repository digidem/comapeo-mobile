import * as React from 'react';
import {ScrollView} from 'react-native';
import {defineMessages} from 'react-intl';
import {usePersistedLocale} from '../../../hooks/persistedState/usePersistedLocale';
import {supportedLanguages} from '../../../lib/intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.LanguageSettings.title',
    defaultMessage: 'Language',
    description: 'Title language settings screen',
  },
});

export const LanguageSettings: NativeNavigationComponent<
  'LanguageSettings'
> = () => {
  const locale = usePersistedLocale(store => store.locale);
  const setLocale = usePersistedLocale(store => store.setLocale);

  const options = supportedLanguages.map(
    ({locale: supportedLocale, nativeName, englishName}) => ({
      value: supportedLocale,
      label: nativeName,
      hint: englishName,
    }),
  );

  return (
    <ScrollView testID="languageScrollView">
      <SelectOne
        value={locale}
        options={options}
        onChange={selectedLocale => setLocale(selectedLocale)}
      />
    </ScrollView>
  );
};

LanguageSettings.navTitle = m.title;
