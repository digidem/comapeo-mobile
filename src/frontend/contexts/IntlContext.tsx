import * as React from 'react';
import {IntlProvider as ReactIntlProvider, CustomFormats} from 'react-intl';
import {StyleSheet, Text} from 'react-native';
import {useLocales} from 'expo-localization';
import {useQuery, keepPreviousData} from '@tanstack/react-query';
import type {MessageFormatElement} from '@formatjs/icu-messageformat-parser';

import {localeImports} from '../../../translations/index';
import {useLocaleState} from './LocaleStoreContext';
import {getUsableLanguageTag, type AvailableLanguageTag} from '../lib/intl';
import {Loading} from '../sharedComponents/Loading';

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

  const languages = React.useMemo(() => {
    const usableSystemLanguageTags = systemLocales
      .map(l => getUsableLanguageTag(l.languageTag))
      .filter((tag): tag is AvailableLanguageTag => tag !== undefined);
    return [languageTag, ...usableSystemLanguageTags];
  }, [languageTag, systemLocales]);

  const {data: messagesToUse, isPending} = useQuery({
    queryKey: ['messages', ...languages],
    queryFn: async () => {
      const results = await Promise.all(
        // reversing languages mean the highest priority languages get merged last and overwites the lower priority languages
        languages
          .reverse()
          .map(
            tag =>
              localeImports[tag]?.().then(m => m.default) ??
              Promise.resolve({}),
          ),
      );
      const merged: Record<string, MessageFormatElement[]> = {};
      for (const msgs of results) {
        Object.assign(merged, msgs);
      }
      return merged;
    },
    staleTime: Infinity,
    // see: https://tanstack.com/query/latest/docs/react/guides/paginated-queries#better-paginated-queries-with-placeholderdata
    placeholderData: keepPreviousData,
  });

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
