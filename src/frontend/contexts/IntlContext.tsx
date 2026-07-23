import * as React from 'react';
import {
  IntlProvider as ReactIntlProvider,
  CustomFormats,
  MessageFormatElement,
} from 'react-intl';
import {StyleSheet, Text} from 'react-native';
import {useLocales} from 'expo-localization';

import {useLocaleState} from './LocaleStoreContext';
import {
  getUsableLanguageTag,
  configureCalendarLocale,
  type AvailableLanguageTag,
} from '../lib/intl';
import {FullScreenCenteredLoader} from '../sharedComponents/FullScreenCenteredLoader';
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

  const messages = useLanguageQueries(languageCodes);

  // pending only when NONE of the languages are available, in other word will NOT be pending if 1 language is available
  // this guarantees that the app doesn't unmount when the language is switched
  // And it will fallback to the avaialble langauges when the new chosen language is pending
  const isPending = messages.every(queryResult => queryResult.isPending);

  // reduceRight means the highest priority languages (start of the array)
  // get merged last and overwrite the lower priority languages
  const messagesToUse = React.useMemo(
    () =>
      messages.reduceRight<Record<string, MessageFormatElement[]>>(
        (merged, queryResult) => ({...merged, ...queryResult.data}),
        {},
      ),
    [messages],
  );

  React.useEffect(() => {
    if (!isPending) {
      configureCalendarLocale(
        // Don't use the `messagesToUse`.
        // This function need to know if the `day` and `month` translations are not avaialble
        // If the `day` and `month` translations are not avaialble, it will pull the `day` and `month` translations directly from intl
        // `messagesToUse` will always have the english fallback and this function won't know that the translations are not availble
        {
          translatedMessages: Object.fromEntries(
            languageCodes.map((code, i) => [code, messages[i]?.data ?? {}]),
          ),
          languageCodes,
        },
      );
    }
  }, [languageCodes, messages, isPending]);

  if (isPending) {
    return <FullScreenCenteredLoader />;
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
