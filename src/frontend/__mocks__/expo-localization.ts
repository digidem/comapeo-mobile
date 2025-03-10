import {
  getLocales as _getLocales,
  useLocales as _useLocales,
  type Locale,
} from 'expo-localization';

import {extractLanguageCode} from '../lib/intl';

export const getLocales: typeof _getLocales = () => {
  return [createBaseLocale('en-US')];
};

// eslint-disable-next-line @eslint-react/hooks-extra/no-useless-custom-hooks
export const useLocales: typeof _useLocales = () => {
  return [createBaseLocale('en-US')];
};

function createBaseLocale(languageTag: string): Locale {
  return {
    languageTag,
    languageCode: extractLanguageCode(languageTag),
    langageCurrencyCode: null,
    langageCurrencySymbol: null,
    languageRegionCode: null,
    regionCode: null,
    currencyCode: null,
    currencySymbol: null,
    decimalSeparator: null,
    digitGroupingSeparator: null,
    textDirection: null,
    measurementSystem: null,
    temperatureUnit: null,
  };
}
