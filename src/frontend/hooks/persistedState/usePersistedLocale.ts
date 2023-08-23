import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type LocaleSlice = {
  locale: string;
  setLocale: (locale: string) => void;
};

const localeSlice: StateCreator<LocaleSlice> = (set, get) => ({
  locale: 'en',
  setLocale: newlocale => set({locale: newlocale}),
});

export const usePersistedLocale = createPersistedState(localeSlice, 'MapeoLocale');
