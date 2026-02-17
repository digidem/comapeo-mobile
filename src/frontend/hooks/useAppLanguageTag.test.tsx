import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {Locale, useLocales} from 'expo-localization';

import {
  createLocaleStore,
  type LocaleStore,
  LocaleStoreProvider,
  useLocaleActions,
} from '../contexts/LocaleStoreContext';
import {useAppLanguageTag} from './useAppLanguageTag';

function createWrapper(store: LocaleStore) {
  return ({children}: {children: ReactNode}) => {
    return <LocaleStoreProvider value={store}>{children}</LocaleStoreProvider>;
  };
}

// Override the global mock that's done in jest.setup.js
jest.mock('expo-localization', () => {
  return {
    useLocales: jest.fn(),
  };
});

// Not strictly necessary to create this but helpful to make the tests a bit more descriptive
function setSystemPreferredLocales(locales: string[]) {
  jest.mocked(useLocales).mockReturnValue(locales.map(mockLocale));
}

// Has to start with `mock` for jest to not complain
function mockLocale(languageTag: string): Locale {
  return {
    languageTag,
    languageCode: null,
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

afterEach(() => {
  jest.restoreAllMocks();
});

describe('no locale chosen and no system preferences', () => {
  test('returns the fallback (en)', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(
      // This is very unlikely to ever happen given how the library works but doesn't hurt to test anyways
      // https://github.com/expo/expo/blob/5585320eec9271038cd7c672b4cf9f0e945ca658/packages/expo-localization/src/Localization.ts#L123
      [],
    );

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('en');
  });
});

describe('no specific locale selected and single system preference exists', () => {
  test('uses system preference if supported', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(['pt']);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('pt');
  });

  test('uses system preference with regional code stripped (recognized regional code)', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('pt');
  });

  test('uses system preference with regional code stripped (unrecognized regional code)', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales([
      // Intentionally somewhat nonsense
      'pt-ZZ',
    ]);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('pt');
  });

  test('uses fallback if not supported', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
    ]);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('en');
  });
});

describe('using system and multiple system preferences exist', () => {
  test('respects ordering of system preferences', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(['es', 'pt']);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('es');

    act(() => {
      setSystemPreferredLocales(['pt', 'es']);
    });

    languageTagHook.rerender({});

    expect(languageTagHook.result.current).toBe('pt');
  });

  test('uses first supported system preference', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      'pt',
    ]);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('pt');
  });

  test('uses fallback if none of the system preferences are supported', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      // Intentionally nonsense
      '^^',
    ]);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('en');
  });
});

describe('specific locale chosen', () => {
  test('reacts to changes in selected locale', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('pt');

    const localeActionsHook = renderHook(() => useLocaleActions(), {
      wrapper,
    });

    act(() => {
      localeActionsHook.result.current.setLanguageTag('es');
    });

    expect(languageTagHook.result.current).toBe('es');

    act(() => {
      localeActionsHook.result.current.setLanguageTag(null);
    });

    expect(languageTagHook.result.current).toBe('pt');

    act(() => {
      localeActionsHook.result.current.setLanguageTag('en');
    });

    expect(languageTagHook.result.current).toBe('en');
  });

  test('is not affected by changes in system preferences', () => {
    const store = createLocaleStore();
    const wrapper = createWrapper(store);

    setSystemPreferredLocales(['pt-BR']);

    const localeActionsHook = renderHook(() => useLocaleActions(), {
      wrapper,
    });

    act(() => {
      localeActionsHook.result.current.setLanguageTag('es');
    });

    const languageTagHook = renderHook(() => useAppLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toBe('es');

    setSystemPreferredLocales(['en-US']);
    languageTagHook.rerender({});

    expect(languageTagHook.result.current).toBe('es');

    // Intentionally nonsense
    setSystemPreferredLocales(['__']);
    languageTagHook.rerender({});

    expect(languageTagHook.result.current).toBe('es');
  });
});
