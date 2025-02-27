import {type ReactNode} from 'react';
import {act, renderHook} from '@testing-library/react-native';
import {
  createSelectedLocaleStore,
  SelectedLocaleStore,
  SelectedLocaleStoreProvider,
  useSelectedLocaleActions,
} from '../contexts/SelectedLocaleContext';
import {useResolvedLanguageTag} from './useResolvedLanguageTag';
import {Locale, useLocales} from 'expo-localization';

function createWrapper(selectedLocaleStore: SelectedLocaleStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SelectedLocaleStoreProvider value={selectedLocaleStore}>
        {children}
      </SelectedLocaleStoreProvider>
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

describe('Nothing persisted and no system preferences', () => {
  test('Returns the fallback (en)', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(
      // This is very unlikely to ever happen given how the library works but doesn't hurt to test anyways
      // https://github.com/expo/expo/blob/5585320eec9271038cd7c672b4cf9f0e945ca658/packages/expo-localization/src/Localization.ts#L123
      [],
    );

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('Nothing persisted and single system preference exists', () => {
  test('Returns system preference if supported', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Returns system preference with regional code stripped (recognized regional code)', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt-BR']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Returns system preference with regional code stripped (unrecognized regional code)', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales([
      // Intentionally somewhat nonsense
      'pt-ZZ',
    ]);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Returns fallback if not supported', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
    ]);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('Nothing persisted and multiple system preferences exist', () => {
  test('Respects ordering of system preferences', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['es', 'pt']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'es',
    });

    act(() => {
      setSystemPreferredLocales(['pt', 'es']);
    });

    resolvedLocaleHook.rerender({});

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Returns first supported system preference', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      'pt',
    ]);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Returns fallback if none of the system preferences are supported', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales([
      // Intentionally nonsense
      '__',
      // Intentionally nonsense
      '^^',
    ]);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});

describe('Selected locale exists', () => {
  test('Returns selected locale if supported', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt-BR']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const selectedLocaleActionsHook = renderHook(
      () => useSelectedLocaleActions(),
      {wrapper},
    );

    act(() => {
      selectedLocaleActionsHook.result.current.setLanguageTag('es');
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });

    act(() => {
      selectedLocaleActionsHook.result.current.setLanguageTag('en-US');
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'en',
    });
  });

  test('Returns selected locale if supported when omitting extended tag', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt-BR']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const selectedLocaleActionsHook = renderHook(
      () => useSelectedLocaleActions(),
      {wrapper},
    );

    act(() => {
      // Intentionally somewhat nonsense
      selectedLocaleActionsHook.result.current.setLanguageTag('es-ZZ');
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });
  });

  test('Does not use selected locale if it is not supported', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt-BR']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const selectedLocaleActionsHook = renderHook(
      () => useSelectedLocaleActions(),
      {wrapper},
    );

    act(() => {
      // Intentionally nonsense
      selectedLocaleActionsHook.result.current.setLanguageTag('__');
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });

  test('Respects selected locale being unset', () => {
    const selectedLocaleStore = createSelectedLocaleStore();
    const wrapper = createWrapper(selectedLocaleStore);

    setSystemPreferredLocales(['pt-BR']);

    const resolvedLocaleHook = renderHook(() => useResolvedLanguageTag(), {
      wrapper,
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });

    const selectedLocaleActionsHook = renderHook(
      () => useSelectedLocaleActions(),
      {wrapper},
    );

    act(() => {
      selectedLocaleActionsHook.result.current.setLanguageTag('es');
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'selected',
      value: 'es',
    });

    act(() => {
      selectedLocaleActionsHook.result.current.setLanguageTag(null);
    });

    expect(resolvedLocaleHook.result.current).toStrictEqual({
      source: 'system',
      value: 'pt',
    });
  });
});
