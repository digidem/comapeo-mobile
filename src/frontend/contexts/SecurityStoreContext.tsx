import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {PasscodeSchema} from '../lib/security';
import {type CreateStoreOpts} from '../sharedTypes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SecurityStateSchema = v.variant('passcode', [
  v.object({
    passcode: PasscodeSchema,
    obscureCodeEnabled: v.boolean(),
  }),
  v.object({
    passcode: v.null(),
    obscureCodeEnabled: v.literal(false),
  }),
]);

export type SecurityState = v.InferOutput<typeof SecurityStateSchema>;

// NOTE: Do not change!
const STORAGE_KEY = 'security' as const;

function createInitialState(): SecurityState {
  return {
    passcode: null,
    obscureCodeEnabled: false,
  };
}

export function createSecurityStore(opts: CreateStoreOpts) {
  let store: StoreApi<SecurityState>;

  if (opts.persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        version: 0,
        storage: createJSONStorage(() => opts.storage),
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
