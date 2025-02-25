/**
 * @import {Locale} from 'expo-localization'
 */

jest.mock('expo-localization', () => {
  return {
    getLocales: () => [createBaseLocale('en-US')],
    useLocales: () => {
      return [createBaseLocale('en-US')];
    },
  };

  /**
   * @param {string} languageTag
   * @returns {Locale}
   */
  function createBaseLocale(languageTag) {
    return {
      languageTag,
      languageCode: null,
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
});
