import * as React from 'react';
import {IntlProvider as ReactIntlProvider, CustomFormats} from 'react-intl';
import {StyleSheet, Text} from 'react-native';
import {useLocales} from 'expo-localization';

import {useLocaleState} from './LocaleStoreContext';
import {getUsableLanguageTag, type AvailableLanguageTag} from '../lib/intl';
import {Loading} from '../sharedComponents/Loading';
import {useLanguageQueries} from '../hooks/useLanguageQueries';

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
  const languageTag = useLocaleState(s => s.languageTag);
  const systemLocales = useLocales();

  const languageCodes = React.useMemo(() => {
    const usableSystemLanguageTags = systemLocales
      .map(l => getUsableLanguageTag(l.languageTag))
      .filter((tag): tag is AvailableLanguageTag => tag !== undefined);
    return Array.from(new Set([languageTag, ...usableSystemLanguageTags]));
  }, [languageTag, systemLocales]);

  const {data: messagesToUse, isPending} = useLanguageQueries(languageCodes);

  if (isPending) {
    return <Loading />;
  }

  return (
    <ReactIntlProvider
      locale={languageTag}
      messages={messagesToUse}
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
