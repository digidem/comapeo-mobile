import {deleteItemAsync, getItem, setItem} from 'expo-secure-store';
import {createContext, useContext} from 'react';
import * as v from 'valibot';
import {createStore, useStore, type StoreApi} from 'zustand';
import {
  createJSONStorage,
  StateStorage,
  persist as createPersistedState,
} from 'zustand/middleware';

import {
  hashPasscode,
  generateSalt,
  PasscodeInputSchema,
  StoredPasscodeSchema,
} from '../lib/security';
import {FullScreenCenteredLoader} from '../sharedComponents/FullScreenCenteredLoader';

const SecurityStateSchema = v.variant('passcode', [
  v.object({
    passcode: StoredPasscodeSchema,
    obscureCodeEnabled: v.boolean(),
    failedAttempts: v.number(),
    lockUntil: v.number(),
    _hasHydrated: v.boolean(),
  }),
  v.object({
    passcode: v.null(),
    obscureCodeEnabled: v.literal(false),
    failedAttempts: v.literal(0),
    lockUntil: v.literal(0),
    _hasHydrated: v.literal(false),
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
    _hasHydrated: false,
  };
}

/**
 * @deprecated Removed in v1. Use SecurityState instead.
 */
type LegacyPasscodeState = {
  passcode: string;
  obscureCodeEnabled?: boolean;
  failedAttempts?: number;
  lockUntil?: number;
};

const migrate = async (
  persistedState: unknown,
  version: number,
): Promise<SecurityState> => {
  if (version === 1) {
    return persistedState as SecurityState;
  }
  try {
    const raw = persistedState as LegacyPasscodeState;

    if (typeof raw.passcode === 'string') {
      const salt = generateSalt();
      const hashed = await hashPasscode({passcode: raw.passcode, salt});
      return {
        passcode: hashed,
        obscureCodeEnabled: raw.obscureCodeEnabled ?? false,
        failedAttempts: raw.failedAttempts ?? 0,
        lockUntil: raw.lockUntil ?? 0,
        _hasHydrated: true,
      };
    }

    const parsed = v.parse(SecurityStateSchema, persistedState);
    return {...parsed};
  } catch {
    return createInitialState();
  }
};

export function createSecurityStore({persist} = {persist: false}) {
  let store: StoreApi<SecurityState>;

  if (persist) {
    store = createStore(
      createPersistedState(createInitialState, {
        name: STORAGE_KEY,
        version: 1,
        migrate,
        storage: createJSONStorage((): StateStorage => ({
          getItem: key => getItem(key),
          setItem: (key, value) => setItem(key, value),
          removeItem: key => deleteItemAsync(key),
        })),
        onRehydrateStorage: () => {
          return (state?: SecurityState) => {
            if (state) {
              state._hasHydrated = true;
            }
          };
        },
      }),
    );
  } else {
    // hydration set to true here because when you are creating a NON persisted store,
    // you are setting the store to the value returned by createInitialState(),
    // where _hasHydrated will always return false unless we otherwise specify
    store = createStore<SecurityState>(
      () =>
        ({
          ...createInitialState(),
          _hasHydrated: true,
        }) as SecurityState,
    );
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
      const hashed = await hashPasscode({passcode, salt});
      store.setState({passcode: hashed});
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
export const SecurityStoreProvider = ({
  value,
  children,
}: {
  value: SecurityStore;
  children: React.ReactNode;
}) => {
  const hasHydrated = useStore(value.instance, state => state._hasHydrated);

  return (
    <SecurityStoreContext value={value}>
      {!hasHydrated ? <FullScreenCenteredLoader /> : children}
    </SecurityStoreContext>
  );
};

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
