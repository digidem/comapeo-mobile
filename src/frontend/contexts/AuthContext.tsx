import * as React from 'react';
import {AppState, AppStateStatus, NativeModules} from 'react-native';
const {FlagSecureModule} = NativeModules;

import {useIsShareDialogOpen} from '../hooks/share';
import {DEFAULT_OBSCURE_CODE} from '../lib/security';
import {useSecurityState} from './SecurityStoreContext';
import {useIsAudioPermissionModalOpen} from '../hooks/useAudioPermissionTracker';

export type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

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
  // If E2E test mode is enabled, disable FlagSecure to allow screen recordings on BrowserStack
  const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';
  const shareDialogIsOpen = useIsShareDialogOpen();
  const isAudioPermissionModalOpen = useIsAudioPermissionModalOpen();

  React.useEffect(() => {
    if (passcode !== null && !isE2E) {
      FlagSecureModule.activate();
    } else {
      FlagSecureModule.deactivate();
    }
  }, [passcode, isE2E]);

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // If the app state changes due to opening a share dialog or the in app Audio Permissions, do not unauthenticate
        if (shareDialogIsOpen || isAudioPermissionModalOpen) return;

        if (passcode !== null) {
          if (
            nextAppState === 'active' ||
            nextAppState === 'background' ||
            nextAppState === 'inactive'
          ) {
            setAuthState('unauthenticated');
          }
        }
      },
    );

    return () => appStateListener.remove();
  }, [passcode, shareDialogIsOpen, isAudioPermissionModalOpen]);

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
