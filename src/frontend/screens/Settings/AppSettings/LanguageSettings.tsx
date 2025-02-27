import * as React from 'react';
import {defineMessages} from 'react-intl';
import {ScrollView} from 'react-native';

import {useSelectedLocaleActions} from '../../../contexts/SelectedLocaleContext';
import {useResolvedLanguageTag} from '../../../hooks/useResolvedLanguageTag';
import {USABLE_LANGUAGES} from '../../../lib/intl';
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
> = ({navigation}) => {
  const resolvedLanguageTag = useResolvedLanguageTag();
  const {setLanguageTag} = useSelectedLocaleActions();

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
          setLanguageTag(value);
          navigation.popTo('AppSettings');
        }}
      />
    </ScrollView>
  );
};

LanguageSettings.navTitle = m.title;
