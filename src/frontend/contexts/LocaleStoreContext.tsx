import {createContext, useContext} from 'react';
import {getLocales} from 'expo-localization';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {
  getUsableLanguageTagFromSystemPreferences,
  SupportedLanguageTag,
} from '../lib/intl';
import {type LocaleState} from '../sharedTypes/locale';

// Do not change!
export const STORAGE_KEY = 'locale' as const;

function createInitialState(): LocaleState {
  const systemLanguageTags = getLocales().map(l => l.languageTag);
  return {
    languageTag: getUsableLanguageTagFromSystemPreferences(systemLanguageTags),
    useSystemPreferences: true,
  };
}

/**
 * Migrates persisted state from version 0 (where languageTag could be null)
 * to version 1 (where languageTag is always resolved).
 */
function migrate(persistedState: unknown, version: number): LocaleState {
  if (version === 1) {
    return persistedState as LocaleState;
  }
  // version 0: languageTag was null | SupportedLanguageTag
  const legacy = persistedState as {
    languageTag: SupportedLanguageTag | null;
    useSystemPreferences: boolean;
  };
  if (legacy.languageTag !== null) {
    return {
      languageTag: legacy.languageTag,
      useSystemPreferences: legacy.useSystemPreferences,
    };
  }
  // null means "use system preferences" — resolve now
  return createInitialState();
}

export function createLocaleStore({persist} = {persist: false}) {
  let store: StoreApi<LocaleState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVStoreInitializer),
        version: 1,
        migrate,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setLanguageTag: (
      languageTag: SupportedLanguageTag | 'SystemPreference',
    ) => {
      if (languageTag === 'SystemPreference') {
        const systemLanguageTags = getLocales().map(l => l.languageTag);
        store.setState({
          languageTag:
            getUsableLanguageTagFromSystemPreferences(systemLanguageTags),
          useSystemPreferences: true,
        });
      } else {
        store.setState({
          languageTag,
          useSystemPreferences: false,
        });
      }
    },
  };

  return {instance: store, actions};
}

export type LocaleStore = ReturnType<typeof createLocaleStore>;

const LocaleContext = createContext<LocaleStore | null>(null);

export const LocaleStoreProvider = LocaleContext;

function useLocaleContext() {
  const value = useContext(LocaleContext);

  if (!value) {
    throw new Error('Must set up SelectedLocaleStoreProvider first');
  }

  return value;
}

export function useLocaleState(): LocaleState;
export function useLocaleState<T>(selector: (state: LocaleState) => T): T;
export function useLocaleState<T>(selector?: (state: LocaleState) => T) {
  const {instance} = useLocaleContext();
  return useStore(instance, selector!);
}

export function useLocaleActions() {
  const {actions} = useLocaleContext();
  return actions;
}
