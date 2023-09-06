import * as React from 'react';
import {AppState, AppStateStatus, NativeEventSubscription} from 'react-native';
import {create} from 'zustand';
import {
  usePersistedObscureCode,
  usePersistedPasscode,
} from '../persistedState/usePersistedPasscode';

type AuthStateSlice = {
  authState: AuthState;
  authValuesSet: AuthValuesSet;
  setAuthState: (state: AuthState) => void;
};

type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

type AuthValuesSet = {
  passcodeSet: boolean;
  obscureSet: boolean;
};

export function useAuthValues() {
  const authState = authStateSlice(store => store.authState);
  const authValuesSet = authStateSlice(store => store.authValuesSet);

  return {authState, authValuesSet, authenticate};
}

export function useAuthListener() {
  const [passcodeSet, obscureSet] = authStateSlice(store => [
    store.authValuesSet.passcodeSet,
    store.authValuesSet.obscureSet,
  ]);
  const setAuthState = authStateSlice(store => store.setAuthState);
  const authState = authStateSlice(store => store.authState);
  const [, setObscureCode] = usePersistedObscureCode();
  const appStateListener = React.useRef<NativeEventSubscription | null>(null);

  if (passcodeSet && !appStateListener.current) {
    appStateListener.current = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          nextAppState === 'active' ||
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          setAuthState('unauthenticated');
        }
      },
    );
  }

  if (!passcodeSet) {
    if (authState !== 'authenticated') {
      setAuthState('authenticated');
    }

    if (obscureSet) {
      setObscureCode(null);
    }

    if (appStateListener.current) {
      appStateListener.current.remove();
      appStateListener.current = null;
    }
  }

  React.useEffect(() => {
    return () => {
      if (appStateListener.current) {
        appStateListener.current.remove();
        appStateListener.current = null;
      }
    };
  }, []);
}

const authStateSlice = create<AuthStateSlice>()((set, get) => {
  const [passcode] = usePersistedPasscode();
  const [obscureCode] = usePersistedObscureCode();

  return {
    authState: 'unauthenticated',
    authValuesSet: {
      passcodeSet: passcode !== null,
      obscureSet: obscureCode !== null,
    },
    setAuthState: state => set({authState: state}),
  };
});

function authenticate(passcodeValue: string, validateOnly = false) {
  const [passcode] = usePersistedPasscode();
  const [obscureCode] = usePersistedObscureCode();
  const setAuthState = authStateSlice(store => store.setAuthState);
  const {obscureSet} = authStateSlice(store => store.authValuesSet);

  if (validateOnly) return passcodeValue === passcode;

  if (obscureSet && passcodeValue === obscureCode) {
    setAuthState('obscured');
    return true;
  }

  if (passcodeValue === passcode) {
    setAuthState('authenticated');
    return true;
  }

  throw new Error('Incorrect Passcode');
}
