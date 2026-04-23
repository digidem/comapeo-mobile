import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';

import {
  useLocaleActions,
  useLocaleState,
} from '../../../contexts/LocaleStoreContext';
import {USABLE_LANGUAGES} from '../../../lib/intl';
import {type NativeNavigationComponent} from '../../../sharedTypes/navigation';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {BLUE_GREY} from '../../../lib/styles';
import {useAppLanguageTag} from '../../../hooks/useAppLanguageTag';

const m = defineMessages({
  title: {
    id: '$1screens.LanguageSettings.title',
    defaultMessage: 'Language',
    description: 'Title language settings screen',
  },
  followSystemPreferences: {
    id: '$1screens.LanguageSettings.followSystemPreferences',
    defaultMessage: 'Follow system preferences',
    description: 'Label for language option to follow system preferences',
  },
  currentLang: {
    id: '$1screens.LanguageSettings.currentLang',
    defaultMessage: 'Current Language',
  },
  otherLang: {
    id: '$1screens.LanguageSettings.otherLang',
    defaultMessage: 'Other Languages',
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
> = () => {
  const {formatMessage} = useIntl();
  const locale = useLocaleState();
  const appLocale = useAppLanguageTag();
  const {setLanguageTag} = useLocaleActions();

  const options = React.useMemo(() => {
    return [
      {
        value: null,
        label: formatMessage(m.followSystemPreferences),
      },
      ...LANGUAGE_OPTIONS,
    ];
  }, [formatMessage]);

  return (
    <FlatList
      testID="languageScrollView"
      style={styles.container}
      data={options}
      ListHeaderComponent={
        <>
          <HeaderText style={{marginBottom: 12}} variant="header6">
            {formatMessage(m.currentLang)}
          </HeaderText>
          <View style={styles.currentContainer}>
            <MaterialIcon
              name={'language'}
              size={24}
              color={'rgba(0, 0, 0, 0.54)'}
            />
            <HeaderText variant="header6">
              {LANGUAGE_OPTIONS.find(o => o.value === appLocale)?.label ??
                appLocale}
            </HeaderText>
          </View>
          <View style={styles.divider} />
          <HeaderText
            style={{marginTop: 30, marginBottom: 15}}
            variant="header6">
            {formatMessage(m.otherLang)}
          </HeaderText>
        </>
      }
      renderItem={({item}) => {
        const isSelected = item.value === locale.languageTag;
        return (
          <TouchableOpacity
            onPress={() => {
              setLanguageTag(item.value);
            }}
            testID={`${item.value ?? 'null'}RadioButton`}
            accessibilityRole="radio"
            accessibilityState={{checked: isSelected}}
            style={styles.languageContainer}>
            <MaterialIcon
              name={
                isSelected ? 'radio-button-checked' : 'radio-button-unchecked'
              }
              size={24}
              color={'rgba(0, 0, 0, 0.54)'}
            />
            <View>
              <HeaderText testID="" variant="header6">
                {item.label}
              </HeaderText>
              {'hint' in item && (
                <BodyText variant="tinyMeta">{item.hint}</BodyText>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

LanguageSettings.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  currentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 15,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: BLUE_GREY,
  },
});
