import {StateCreator} from 'zustand';
import {getLocales} from 'expo-localization';

import {getSupportedLocale} from '../../lib/intl';
import {createPersistedState} from './createPersistedState';

type LocaleSlice = {
  locale: string;
  setLocale: (locale: string) => void;
};

export const getDeviceLanguageTag = (): string =>
  // We can use this non-null assertion with `getLocales()` because, according
  // to [the docs][1], the result is "guaranteed to contain at least 1 element."
  // [1]: https://github.com/expo/expo/blob/5585320eec9271038cd7c672b4cf9f0e945ca658/packages/expo-localization/src/Localization.ts#L123
  getLocales()[0]!.languageTag;

const localeSlice: StateCreator<LocaleSlice> = set => ({
  locale: getSupportedLocale(getDeviceLanguageTag()) || 'en',
  setLocale: newlocale => set({locale: newlocale}),
});

export const usePersistedLocale = createPersistedState(
  localeSlice,
  'MapeoLocale',
);
