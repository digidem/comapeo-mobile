import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createLocaleStore,
  LocaleContext,
  LocaleStore,
  useLocaleActions,
  useLocaleState,
} from './LocaleStoreContext';

function createWrapper(store: LocaleStore) {
  return ({children}: {children: ReactNode}) => {
    return <LocaleContext value={store}>{children}</LocaleContext>;
  };
}

test('usage of state and actions hooks', async () => {
  const store = createLocaleStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useLocaleActions(), {
    wrapper,
  });

  const stateHook = await renderHook(() => useLocaleState(), {
    wrapper,
  });

  // Initial state: languageTag is resolved from system preferences (falls back to 'en' in test environment)
  expect(stateHook.result.current).toStrictEqual({
    languageTag: 'en',
    useSystemPreferences: true,
  });

  await act(async () => {
    actionsHook.result.current.setLanguageTag('pt');
  });

  expect(stateHook.result.current).toStrictEqual({
    useSystemPreferences: false,
    languageTag: 'pt',
  });

  await act(async () => {
    actionsHook.result.current.setLanguageTag('SystemPreference');
  });

  // Back to system preference — resolved from system locales (falls back to 'en' in test environment)
  expect(stateHook.result.current).toStrictEqual({
    languageTag: 'en',
    useSystemPreferences: true,
  });
});
