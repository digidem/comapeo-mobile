import {deleteItemAsync, getItem, setItem} from 'expo-secure-store';
import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {
  hashPasscode,
  generateSalt,
  PasscodeInputSchema,
  StoredPasscodeSchema,
} from '../lib/security';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SecurityStateSchema = v.variant('passcode', [
  v.object({
    passcode: StoredPasscodeSchema,
    obscureCodeEnabled: v.boolean(),
    failedAttempts: v.number(),
    lockUntil: v.number(),
  }),
  v.object({
    passcode: v.null(),
    obscureCodeEnabled: v.literal(false),
    failedAttempts: v.literal(0),
    lockUntil: v.literal(0),
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
    lockUntil: 0,
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
    setPasscode: async (passcode: string | null) => {
      // Obscure code needs to be unset when passcode is unset
      if (passcode === null) {
        store.setState({
          passcode: null,
          obscureCodeEnabled: false,
          failedAttempts: 0,
          lockUntil: 0,
        });
        return;
      }
      v.parse(PasscodeInputSchema, passcode, {abortPipeEarly: true});
      const salt = generateSalt();
      const hashed = await hashPasscode(passcode, salt);

      store.setState({
        passcode: hashed,
      });
    },

    updateToHashedPasscode: async (passcode: string) => {
      const salt = generateSalt();
      const hashed = await hashPasscode(passcode, salt);
      store.setState({passcode: hashed});
      await setItem(
        STORAGE_KEY,
        JSON.stringify({...store.getState(), passcode: hashed}),
      );
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
      store.setState({failedAttempts: 0, lockUntil: 0});
    },

    setLockUntil: (lockUntil: number) => {
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
