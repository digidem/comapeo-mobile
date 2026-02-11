import {
  getLocales as _getLocales,
  useLocales as _useLocales,
  type Locale,
} from 'expo-localization';

import {extractLanguageCode} from '../lib/intl';

export const getLocales: typeof _getLocales = () => {
  return [createBaseLocale('en-US')];
};

export const useLocales: typeof _useLocales = () => {
  return [createBaseLocale('en-US')];
};

function createBaseLocale(languageTag: string): Locale {
  return {
    languageTag,
    languageCode: extractLanguageCode(languageTag),
    languageCurrencyCode: null,
    languageCurrencySymbol: null,
    languageRegionCode: null,
    regionCode: null,
    currencyCode: null,
    currencySymbol: null,
    decimalSeparator: null,
    digitGroupingSeparator: null,
    textDirection: null,
    measurementSystem: null,
    temperatureUnit: null,
    languageScriptCode: null,
  };
}
