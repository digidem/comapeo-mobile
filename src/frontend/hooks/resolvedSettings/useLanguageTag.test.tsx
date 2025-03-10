import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {Locale, useLocales} from 'expo-localization';

import {
  createSettingsStore,
  type SettingsStore,
  SettingsStoreProvider,
  useSettingsActions,
} from '../../contexts/SettingsStoreContext';
import {useLanguageTag} from './useLanguageTag';

function createWrapper(settingsStore: SettingsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SettingsStoreProvider value={settingsStore}>
        {children}
      </SettingsStoreProvider>
    );
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

afterEach(() => {
  jest.clearAllMocks();
});

describe('nothing persisted and no system preferences', () => {
  test('returns the fallback (en)', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(
      // This is very unlikely to ever happen given how the library works but doesn't hurt to test anyways
      // https://github.com/expo/expo/blob/5585320eec9271038cd7c672b4cf9f0e945ca658/packages/expo-localization/src/Localization.ts#L123
      [],
    );

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('nothing persisted and single system preference exists', () => {
  test('returns system preference if supported', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('returns system preference with regional code stripped (recognized regional code)', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('returns system preference with regional code stripped (unrecognized regional code)', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales([
      // Intentionally somewhat nonsense
      'pt-ZZ',
    ]);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('returns fallback if not supported', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
    ]);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('nothing persisted and multiple system preferences exist', () => {
  test('respects ordering of system preferences', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['es', 'pt']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'es',
    });

    act(() => {
      setSystemPreferredLocales(['pt', 'es']);
    });

    languageTagHook.rerender({});

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('returns first supported system preference', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      'pt',
    ]);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('returns fallback if none of the system preferences are supported', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      // Intentionally nonsense
      '^^',
    ]);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('selected locale exists', () => {
  test('returns selected locale if supported', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const settingsActionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      settingsActionsHook.result.current.setLocale({languageTag: 'es'});
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });

    act(() => {
      settingsActionsHook.result.current.setLocale({languageTag: 'en-US'});
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'en',
    });
  });

  test('returns selected locale if supported when omitting extended tag', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const settingsActionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      // Intentionally somewhat nonsense
      settingsActionsHook.result.current.setLocale({languageTag: 'es-ZZ'});
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });
  });

  test('does not use selected locale if it is not supported', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const settingsActionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      // Intentionally nonsense
      settingsActionsHook.result.current.setLocale({languageTag: '__'});
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('respects selected locale being unset', () => {
    const settingsStore = createSettingsStore();
    const wrapper = createWrapper(settingsStore);

    setSystemPreferredLocales(['pt-BR']);

    const languageTagHook = renderHook(() => useLanguageTag(), {
      wrapper,
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const settingsActionsHook = renderHook(() => useSettingsActions(), {
      wrapper,
    });

    act(() => {
      settingsActionsHook.result.current.setLocale({languageTag: 'es'});
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });

    act(() => {
      settingsActionsHook.result.current.setLocale(null);
    });

    expect(languageTagHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });
});
