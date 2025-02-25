import {createContext, useContext} from 'react';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';

export const STORAGE_KEY = 'MapeoLocale';

export type SelectedLocaleState = {
  /**
   * Value consisting of a language tag (see https://en.wikipedia.org/wiki/IETF_language_tag)
   * Represents the language that is explicitly chosen via a user action within the app. If null, it means that either:
   *
   * 1. The user has never chosen the language explicitly.
   * 2. The user has unset the language (e.g. to defer to system preferences)
   */
  languageTag: string | null;
};

function createInitialState() {
  return {
    languageTag: null,
  };
}

export function createSelectedLocaleStore({persist} = {persist: false}) {
  let store: StoreApi<SelectedLocaleState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 1,
        migrate: (persistedState, version) => {
          /**
           * Version 0 stores the state as `{ locale: string, setLocale: (locale: string) => void }`.
           * We only need to handle the `locale` field, which is more specifically a language tag.
           */
          if (version === 0) {
            // Ensure that the persisted state for version has expected shape before attempting to migrate
            if (
              typeof persistedState === 'object' &&
              persistedState !== null &&
              'locale' in persistedState &&
              typeof persistedState.locale === 'string'
            ) {
              // TODO: log to Sentry to help understand how often this is happening?
              return {languageTag: persistedState.locale};
            }
          }

          return {languageTag: null};
        },
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setLanguageTag: (languageTag: string | null) => {
      store.setState({languageTag});
    },
  };

  return {instance: store, actions};
}

export type SelectedLocaleStore = ReturnType<typeof createSelectedLocaleStore>;

const SelectedLocaleContext = createContext<SelectedLocaleStore | null>(null);

export const SelectedLocaleStoreProvider = SelectedLocaleContext.Provider;

function useSelectedLocaleContext() {
  const value = useContext(SelectedLocaleContext);

  if (!value) {
    throw new Error('Must set up SelectedLocaleStoreProvider first');
  }

  return value;
}

export function useSelectedLocaleState(): SelectedLocaleState;
export function useSelectedLocaleState<T>(
  selector: (state: SelectedLocaleState) => T,
): T;
export function useSelectedLocaleState<T>(
  selector?: (state: SelectedLocaleState) => T,
) {
  const {instance} = useSelectedLocaleContext();
  return useStore(instance, selector!);
}

export function useSelectedLocaleActions() {
  const {actions} = useSelectedLocaleContext();
  return actions;
}
