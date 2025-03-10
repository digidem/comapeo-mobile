import * as React from 'react';
import {defineMessages} from 'react-intl';
import {ScrollView} from 'react-native';

import {useLanguageTag} from '../../../hooks/resolvedSettings/useLanguageTag';
import {USABLE_LANGUAGES} from '../../../lib/intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useSettingsActions} from '../../../contexts/SettingsStoreContext';

const m = defineMessages({
  title: {
    id: 'screens.LanguageSettings.title',
    defaultMessage: 'Language',
    description: 'Title language settings screen',
  },
});

export const LanguageSettings: NativeNavigationComponent<
  'LanguageSettings'
> = ({navigation}) => {
  const resolvedLanguageTag = useLanguageTag();
  const {setLocale} = useSettingsActions();

  const options = USABLE_LANGUAGES.map(
    ({languageTag, nativeName, englishName}) => ({
      value: languageTag,
      label: nativeName,
      hint: englishName,
    }),
  );

  return (
    <ScrollView testID="languageScrollView">
      <SelectOne
        value={resolvedLanguageTag.value}
        options={options}
        onChange={value => {
          setLocale({languageTag: value});
          navigation.popTo('AppSettings');
        }}
      />
    </ScrollView>
  );
};

LanguageSettings.navTitle = m.title;
