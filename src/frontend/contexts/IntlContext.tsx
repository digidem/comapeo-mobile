import * as React from 'react';
import {IntlProvider as ReactIntlProvider, CustomFormats} from 'react-intl';
import {StyleSheet, Text} from 'react-native';
import {useLocales} from 'expo-localization';

import messages from '../../../translations/messages.json';
import {useAppLanguageTag} from '../hooks/useAppLanguageTag';
import {extractLanguageCode, TranslatedLanguageTag} from '../lib/intl';

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
  const languageTag = useAppLanguageTag();
  const systemLocales = useLocales();

  const messagesToUse = React.useMemo(() => {
    const languageCode = extractLanguageCode(languageTag);
    const systemLanguageTags = systemLocales.map(l => l.languageTag);
    const merged = {};

    // Merge messages in order of priority: specific system locales, app language code, full app language tag
    for (const tag of [
      ...systemLanguageTags.reverse(),
      languageCode,
      languageTag,
    ]) {
      Object.assign(merged, messages[tag as TranslatedLanguageTag] || {});
    }

    return merged;
  }, [languageTag, systemLocales]);

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
