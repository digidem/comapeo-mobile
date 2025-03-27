import * as React from 'react';
import {AppState, AppStateStatus, NativeModules} from 'react-native';
const {FlagSecureModule} = NativeModules;

import {useIsShareDialogOpen} from '../hooks/share';
import {DEFAULT_OBSCURE_CODE} from '../lib/security';
import {useSecurityState} from './SecurityStoreContext';

type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

type AuthContextType = {
  authenticate: (
    passcodeValue: string | null,
    validateOnly?: boolean,
  ) => boolean;
  authState: AuthState;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const value = React.useContext(AuthContext);

  if (!value) {
    throw new Error('Must set up AuthContextProvider first');
  }

  return value;
};

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const {passcode, obscureCodeEnabled} = useSecurityState();
  const [authState, setAuthState] = React.useState<AuthState>(
    passcode === null ? 'authenticated' : 'unauthenticated',
  );

  const shareDialogIsOpen = useIsShareDialogOpen();
  React.useEffect(() => {
    if (!process.env.EXPO_PUBLIC_E2E_TEST) {
      if (passcode !== null) {
        FlagSecureModule.activate();
      } else {
        FlagSecureModule.deactivate();
      }
    }
  }, [passcode]);

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // If the app state changes due to opening a share dialog, do not unauthenticate
        if (shareDialogIsOpen) return;

        if (passcode !== null) {
          if (!process.env.EXPO_PUBLIC_E2E_TEST) {
            FlagSecureModule.activate();
          }
          if (
            nextAppState === 'active' ||
            nextAppState === 'background' ||
            nextAppState === 'inactive'
          ) {
            setAuthState('unauthenticated');
          }
        } else if (!process.env.EXPO_PUBLIC_E2E_TEST) {
          FlagSecureModule.deactivate();
        }
      },
    );

    return () => appStateListener.remove();
  }, [passcode, shareDialogIsOpen]);

  const authenticate: AuthContextType['authenticate'] = React.useCallback(
    (passcodeValue, validateOnly = false) => {
      if (validateOnly) return passcodeValue === passcode;

      if (obscureCodeEnabled && passcodeValue === DEFAULT_OBSCURE_CODE) {
        setAuthState('obscured');
        return true;
      }

      if (passcodeValue === passcode) {
        setAuthState('authenticated');
        return true;
      }

      throw new Error('Incorrect Passcode');
    },
    [passcode, obscureCodeEnabled],
  );

  const contextValue: AuthContextType = React.useMemo(
    () => ({authenticate, authState}),
    [authenticate, authState],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
