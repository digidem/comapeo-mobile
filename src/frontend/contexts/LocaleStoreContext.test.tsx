import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createLocaleStore,
  LocaleStore,
  LocaleStoreProvider,
  useLocaleActions,
  useLocaleState,
} from './LocaleStoreContext';

function createWrapper(store: LocaleStore) {
  return ({children}: {children: ReactNode}) => {
    return <LocaleStoreProvider value={store}>{children}</LocaleStoreProvider>;
  };
}

test('usage of state and actions hooks', () => {
  const store = createLocaleStore();
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(() => useLocaleActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useLocaleState(), {
    wrapper,
  });

  // Initial state: languageTag is resolved from system preferences (falls back to 'en' in test environment)
  expect(stateHook.result.current).toStrictEqual({
    languageTag: 'en',
    useSystemPreferences: true,
  });

  act(() => {
    actionsHook.result.current.setLanguageTag('pt-BR');
  });

  expect(stateHook.result.current).toStrictEqual({
    useSystemPreferences: false,
    languageTag: 'pt-BR',
  });

  act(() => {
    actionsHook.result.current.setLanguageTag('SystemPreference');
  });

  // Back to system preference — resolved from system locales (falls back to 'en' in test environment)
  expect(stateHook.result.current).toStrictEqual({
    languageTag: 'en',
    useSystemPreferences: true,
  });
});
