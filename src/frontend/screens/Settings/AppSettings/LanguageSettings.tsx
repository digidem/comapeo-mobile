import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView} from 'react-native';

import {
  useLocaleActions,
  useLocaleState,
} from '../../../contexts/LocaleStoreContext';
import {USABLE_LANGUAGES} from '../../../lib/intl';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {type NativeNavigationComponent} from '../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.LanguageSettings.title',
    defaultMessage: 'Language',
    description: 'Title language settings screen',
  },
  followSystemPreferences: {
    id: 'screens.LanguageSettings.followSystemPreferences',
    defaultMessage: 'Follow system preferences',
    description: 'Label for language option to follow system preferences',
  },
});

const LANGUAGE_OPTIONS = USABLE_LANGUAGES.map(
  ({languageTag, nativeName, englishName}) => ({
    value: languageTag,
    label: nativeName,
    hint: englishName,
  }),
);

export const LanguageSettings: NativeNavigationComponent<
  'LanguageSettings'
> = ({navigation}) => {
  const {formatMessage: t} = useIntl();
  const locale = useLocaleState();
  const {setLanguageTag} = useLocaleActions();

  const options = React.useMemo(() => {
    return [
      {
        value: null,
        label: t(m.followSystemPreferences),
      },
      ...LANGUAGE_OPTIONS,
    ];
  }, [t]);

  return (
    <ScrollView testID="languageScrollView">
      <SelectOne
        value={locale.languageTag}
        options={options}
        onChange={selected => {
          setLanguageTag(selected);
          navigation.popTo('AppSettings');
        }}
      />
    </ScrollView>
  );
};

LanguageSettings.navTitle = m.title;
