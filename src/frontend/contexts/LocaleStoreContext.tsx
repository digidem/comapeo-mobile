import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {MMKVZustandStorage} from '../hooks/persistedState/createPersistedState';
import {isSupportedLanguageTag, SupportedLanguageTag} from '../lib/intl';

// Do not change!
export const STORAGE_KEY = 'locale' as const;

export const LocaleStateSchema = v.variant('languageTag', [
  v.object({
    languageTag: v.null(),
    useSystemPreferences: v.literal(true),
  }),
  v.object({
    languageTag: v.pipe(
      v.string(),
      v.transform((value): SupportedLanguageTag => {
        if (!isSupportedLanguageTag(value)) {
          throw new Error(`Value is not a supported language tag: ${value}`);
        }
        return value;
      }),
    ),
    useSystemPreferences: v.literal(false),
  }),
]);

export type LocaleState = v.InferOutput<typeof LocaleStateSchema>;

function createInitialState(): LocaleState {
  return {
    languageTag: null,
    useSystemPreferences: true,
  };
}

export function createLocaleStore({persist} = {persist: false}) {
  let store: StoreApi<LocaleState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => MMKVZustandStorage),
        version: 0,
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setLanguageTag: (languageTag: SupportedLanguageTag | null) => {
      store.setState(
        languageTag === null
          ? {
              languageTag,
              useSystemPreferences: true,
            }
          : {
              languageTag,
              useSystemPreferences: false,
            },
      );
    },
  };

  return {instance: store, actions};
}

export type LocaleStore = ReturnType<typeof createLocaleStore>;

const LocaleContext = createContext<LocaleStore | null>(null);

export const LocaleStoreProvider = LocaleContext.Provider;

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
