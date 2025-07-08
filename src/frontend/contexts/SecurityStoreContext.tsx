import {deleteItemAsync, getItem, setItem} from 'expo-secure-store';
import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {PasscodeSchema} from '../lib/security';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SecurityStateSchema = v.variant('passcode', [
  v.object({
    passcode: PasscodeSchema,
    obscureCodeEnabled: v.boolean(),
    failedAttempts: v.number(),
    lockUntil: v.union([v.number(), v.null()]),
  }),
  v.object({
    passcode: v.null(),
    obscureCodeEnabled: v.literal(false),
    failedAttempts: v.number(),
    lockUntil: v.union([v.number(), v.null()]),
  }),
]);

export type SecurityState = v.InferOutput<typeof SecurityStateSchema>;

// NOTE: Do not change!
const STORAGE_KEY = 'security' as const;

function createInitialState(): SecurityState {
  return {
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: null,
  };
}

export function createSecurityStore({persist} = {persist: false}) {
  let store: StoreApi<SecurityState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        version: 0,
        storage: createJSONStorage(() => {
          return {
            getItem: key => {
              return getItem(key);
            },
            setItem: (key, value) => {
              return setItem(key, value);
            },
            removeItem: key => {
              return deleteItemAsync(key);
            },
          };
        }),
      }),
    );
  } else {
    store = createStore(createInitialState);
  }

  const actions = {
    setPasscode: (passcode: string | null) => {
      // Obscure code needs to be unset when passcode is unset
      if (passcode === null) {
        store.setState({passcode, obscureCodeEnabled: false});
        return;
      }

      store.setState({
        passcode: v.parse(PasscodeSchema, passcode, {abortPipeEarly: true}),
      });
    },

    enableObscureCode: (enable: boolean) => {
      const {passcode} = store.getState();

      if (passcode === null) {
        throw new Error('Cannot enable obscure code if passcode is not set');
      }

      store.setState({obscureCodeEnabled: enable});
    },
    incrementAndGetAttempts: () => {
      const current = store.getState().failedAttempts + 1;
      store.setState({failedAttempts: current});
      return current;
    },

    resetFailedAttempts: () => {
      store.setState({failedAttempts: 0, lockUntil: null});
    },

    setLockout: (lockUntil: number) => {
      store.setState({lockUntil});
    },
  };

  return {
    instance: store,
    actions,
  };
}

export type SecurityStore = ReturnType<typeof createSecurityStore>;

export const SecurityStoreContext = createContext<SecurityStore | null>(null);
export const SecurityStoreProvider = SecurityStoreContext.Provider;

function useSecurityStoreContext() {
  const value = useContext(SecurityStoreContext);

  if (!value) {
    throw new Error('Must set up the TrackStoreProvider first');
  }

  return value;
}

export function useSecurityState(): SecurityState;
export function useSecurityState<T>(selector: (state: SecurityState) => T): T;
export function useSecurityState<T>(selector?: (state: SecurityState) => T) {
  const {instance} = useSecurityStoreContext();
  return useStore(instance, selector!);
}

export function useSecurityActions() {
  const {actions} = useSecurityStoreContext();
  return actions;
}
