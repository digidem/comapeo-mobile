import * as React from 'react';
import {IntlProvider as ReactIntlProvider, CustomFormats} from 'react-intl';
import {StyleSheet} from 'react-native';

import messages from '../../../translations/messages.json';
import {usePersistedLocale} from '../hooks/persistedState/usePersistedLocale';
import {TranslatedLocale} from '../lib/intl';
import {Text} from '../sharedComponents/Text';

export const formats: CustomFormats = {
  date: {
    long: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
};

const DEFAULT_RICH_TEXT_MAPPINGS: NonNullable<
  React.ComponentProps<typeof ReactIntlProvider>['defaultRichTextElements']
> = {
  bold: chunk => <Text style={styles.bold}>{chunk}</Text>,
};

export const IntlProvider = ({children}: {children: React.ReactNode}) => {
  const appLocale = usePersistedLocale(store => store.locale);

  const languageCode = appLocale.split('-')[0];

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[languageCode as TranslatedLocale],
    ...(messages[appLocale as TranslatedLocale] || {}),
  };

  return (
    <ReactIntlProvider
      locale={appLocale}
      messages={localeMessages}
      formats={formats}
      onError={onError}
      wrapRichTextChunksInFragment
      defaultRichTextElements={DEFAULT_RICH_TEXT_MAPPINGS}>
      {children}
    </ReactIntlProvider>
  );
};

function onError(e: Error) {
  console.log(e);
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
  },
});
