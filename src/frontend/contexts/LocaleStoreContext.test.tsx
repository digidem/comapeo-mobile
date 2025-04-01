import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {type StateStorage} from 'zustand/middleware';

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

function createStateStorage(
  storage: Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
): StateStorage {
  return {
    getItem: name => {
      return storage.get(name);
    },
    setItem: (name, value) => {
      storage.set(name, value);
    },
    removeItem: name => {
      storage.delete(name);
    },
  };
}

test('usage of state and actions hooks', () => {
  const localeStore = createLocaleStore({persist: false});
  const wrapper = createWrapper(localeStore);

  const actionsHook = renderHook(() => useLocaleActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useLocaleState(), {
    wrapper,
  });

  // Initial state
  expect(stateHook.result.current).toStrictEqual({
    languageTag: null,
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
    actionsHook.result.current.setLanguageTag(null);
  });

  expect(stateHook.result.current).toStrictEqual({
    languageTag: null,
    useSystemPreferences: true,
  });
});

test('persistence', () => {
  const storage = new Map();

  {
    const store = createLocaleStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const actionsHook = renderHook(() => useLocaleActions(), {
      wrapper,
    });

    const stateHook = renderHook(() => useLocaleState(), {
      wrapper,
    });

    expect(stateHook.result.current).toStrictEqual({
      languageTag: null,
      useSystemPreferences: true,
    });

    expect(storage.size).toBe(0);

    act(() => {
      actionsHook.result.current.setLanguageTag('pt-BR');
    });

    expect(storage.size).toBe(1);

    expect(stateHook.result.current).toStrictEqual({
      useSystemPreferences: false,
      languageTag: 'pt-BR',
    });
  }

  // This tests that persisted value is used when setting up another store in isolation
  {
    const store = createLocaleStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useLocaleState(), {
      wrapper,
    });

    expect(stateHook.result.current).toStrictEqual({
      useSystemPreferences: false,
      languageTag: 'pt-BR',
    });
  }
});
