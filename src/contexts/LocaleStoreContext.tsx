import {createContext, useContext} from 'react';
import {getLocales} from 'expo-localization';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';
import * as v from 'valibot';

import {MMKVStoreInitializer} from '../hooks/persistedState/createPersistedState';
import {
  getUsableLanguageTag,
  getUsableLanguageTagFromSystemPreferences,
  AvailableLanguageTag,
} from '../lib/intl';
import {
  LocaleStateSchema,
  LocaleStateSchemaV0,
  type LocaleState,
} from '../sharedTypes/locale';

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
function migrate(persistedState: unknown): LocaleState {
  const currentSchema = v.safeParse(LocaleStateSchema, persistedState);

  if (currentSchema.success) {
    return currentSchema.output;
  }

  const legacyV0 = v.safeParse(LocaleStateSchemaV0, persistedState);
  if (legacyV0.success && legacyV0.output.languageTag !== null) {
    const usableLanguageTag = getUsableLanguageTag(legacyV0.output.languageTag);
    if (usableLanguageTag) {
      return {languageTag: usableLanguageTag, useSystemPreferences: false};
    }
  }
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
        // Runs on every hydration (unlike `migrate`, which only runs on a
        // version bump). Its return value becomes the applied state
        // directly, so there's no need to reach for the store instance,
        // which doesn't exist in the onRehydrateStorage.
        merge: (persistedState, currentState) => {
          const parseResults = v.safeParse(LocaleStateSchema, persistedState);

          if (!parseResults.success) {
            return currentState;
          }

          const validatedPersistedState = parseResults.output;

          if (validatedPersistedState.useSystemPreferences) {
            // usable language tags can change between app boot ups;
            // re-resolve from system preferences in case they changed
            const systemLanguageTags = getLocales().map(l => l.languageTag);
            return {
              ...currentState,
              ...validatedPersistedState,
              languageTag:
                getUsableLanguageTagFromSystemPreferences(systemLanguageTags),
            };
          }

          // checks that the language tag is still an available language
          if (!getUsableLanguageTag(validatedPersistedState.languageTag)) {
            return {...currentState, ...createInitialState()};
          }

          return {...currentState, ...validatedPersistedState};
        },
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setLanguageTag: (
      languageTag: AvailableLanguageTag | 'SystemPreference',
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

export const LocaleContext = createContext<LocaleStore | null>(null);

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
