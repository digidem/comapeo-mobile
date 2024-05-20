import * as React from 'react';
import {IntlProvider as IntlProviderOrig, CustomFormats} from 'react-intl';

import messages from '../../../translations/messages.json';
import {usePersistedLocale} from '../hooks/persistedState/usePersistedLocale';
import {TranslatedLocale} from '../lib/intl';

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

export const IntlProvider = ({children}: {children: React.ReactNode}) => {
  const appLocale = usePersistedLocale(store => store.locale);

  const languageCode = appLocale.split('-')[0];

  // Add fallbacks for non-regional locales (e.g. "en" for "en-GB")
  const localeMessages = {
    ...messages[languageCode as TranslatedLocale],
    ...(messages[appLocale as TranslatedLocale] || {}),
  };

  return (
    <IntlProviderOrig
      key={appLocale}
      locale={appLocale}
      messages={localeMessages}
      formats={formats}
      onError={onError}
      wrapRichTextChunksInFragment>
      {children}
    </IntlProviderOrig>
  );
};

function onError(e: Error) {
  console.log(e);
}
