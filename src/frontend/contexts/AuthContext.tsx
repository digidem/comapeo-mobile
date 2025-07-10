import * as React from 'react';
import {AppState, AppStateStatus, NativeModules} from 'react-native';
const {FlagSecureModule} = NativeModules;

import {useIsShareDialogOpen} from '../hooks/share';
import {DEFAULT_OBSCURE_CODE} from '../lib/security';
import {useSecurityState, useSecurityActions} from './SecurityStoreContext';
import {useIsAudioPermissionModalOpen} from '../hooks/useAudioPermissionTracker';
import {PASSCODE_LOCKOUT_THRESHOLDS} from '../constants';

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
  const {passcode, obscureCodeEnabled, lockUntil} = useSecurityState();
  const {incrementAndGetAttempts, resetFailedAttempts, setLockout} =
    useSecurityActions();
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
      const isLockedOut = lockUntil !== null && Date.now() < lockUntil;
      if (isLockedOut) {
        throw new Error('LOCKED_OUT');
      }

      const isCorrect = passcodeValue === passcode;

      if (validateOnly) {
        if (isCorrect) {
          resetFailedAttempts();
          return true;
        }

        const attempts = incrementAndGetAttempts();
        const threshold = PASSCODE_LOCKOUT_THRESHOLDS.find(
          t => t.attempts === attempts || (attempts > 8 && t.attempts === 8),
        );

        if (threshold) {
          setLockout(Date.now() + threshold.minutes * 60 * 1000);
        }

        return false;
      }

      if (obscureCodeEnabled && passcodeValue === DEFAULT_OBSCURE_CODE) {
        setAuthState('obscured');
        resetFailedAttempts();
        return true;
      }

      if (isCorrect) {
        setAuthState('authenticated');
        resetFailedAttempts();
        return true;
      }

      const attempts = incrementAndGetAttempts();
      const threshold = PASSCODE_LOCKOUT_THRESHOLDS.find(
        t => t.attempts === attempts || (attempts > 8 && t.attempts === 8),
      );

      if (threshold) {
        setLockout(Date.now() + threshold.minutes * 60 * 1000);
      }

      throw new Error('Incorrect Passcode');
    },
    [
      passcode,
      obscureCodeEnabled,
      incrementAndGetAttempts,
      resetFailedAttempts,
      setLockout,
      lockUntil,
      setAuthState,
    ],
  );

  const contextValue: AuthContextType = React.useMemo(
    () => ({authenticate, authState}),
    [authenticate, authState],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
