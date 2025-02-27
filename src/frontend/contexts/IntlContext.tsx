import * as React from 'react';
import {CustomFormats, IntlProvider as ReactIntlProvider} from 'react-intl';
import {StyleSheet, Text} from 'react-native';

import messages from '../../../translations/messages.json';
import {useResolvedLanguageTag} from '../hooks/useResolvedLanguageTag';
import {extractLanguageCode, type TranslatedLanguageTag} from '../lib/intl';

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
  const resolvedLanguageTag = useResolvedLanguageTag();

  const messagesToUse = React.useMemo(() => {
    const languageCode = extractLanguageCode(resolvedLanguageTag.value);

    return {
      // Add fallbacks for non-regional tags (e.g. "en" for "en-GB")
      ...(messages[languageCode as TranslatedLanguageTag] || {}),
      ...(messages[resolvedLanguageTag.value as TranslatedLanguageTag] || {}),
    };
  }, [resolvedLanguageTag.value]);

  return (
    <ReactIntlProvider
      locale={resolvedLanguageTag.value}
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
