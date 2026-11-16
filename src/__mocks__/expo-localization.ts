import {
  getLocales as _getLocales,
  useLocales as _useLocales,
  type Locale,
} from 'expo-localization';

export const getLocales: typeof _getLocales = () => {
  return [createBaseLocale('en')];
};

export const useLocales: typeof _useLocales = () => {
  return [createBaseLocale('en')];
};

function createBaseLocale(languageTag: string): Locale {
  return {
    languageTag,
    languageCode: languageTag,
    languageCurrencyCode: null,
    languageCurrencySymbol: null,
    languageRegionCode: null,
    regionCode: null,
    currencyCode: null,
    currencySymbol: null,
    decimalSeparator: null,
    digitGroupingSeparator: null,
    textDirection: 'ltr',
    measurementSystem: null,
    temperatureUnit: null,
    languageScriptCode: null,
  };
}
