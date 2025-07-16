import * as React from 'react';
import {AppState, AppStateStatus, NativeModules} from 'react-native';
const {FlagSecureModule} = NativeModules;

import {useIsShareDialogOpen} from '../hooks/share';
import {DEFAULT_OBSCURE_CODE, verifyPasscode} from '../lib/security';
import {useSecurityState, useSecurityActions} from './SecurityStoreContext';
import {useIsAudioPermissionModalOpen} from '../hooks/useAudioPermissionTracker';
import {getLockoutThreshold, PasscodeInputSchema} from '../lib/security';
import {safeParse} from 'valibot';

export type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

type AuthContextType = {
  authenticate: (
    passcodeValue: string | null,
    validateOnly?: boolean,
  ) => Promise<boolean>;
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
  const {
    incrementAndGetAttempts,
    resetFailedAttempts,
    setLockout,
    updateToHashedPasscode,
  } = useSecurityActions();
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
    async (passcodeValue, validateOnly = false) => {
      const isLockedOut = lockUntil !== null && Date.now() < lockUntil;
      if (isLockedOut) {
        throw new Error('LOCKED_OUT');
      }

      let isCorrect = false;

      if (passcodeValue && passcode) {
        if (safeParse(PasscodeInputSchema, passcode).success) {
          isCorrect = passcodeValue === passcode;
          await updateToHashedPasscode(passcodeValue);
        } else {
          isCorrect = await verifyPasscode(passcodeValue, passcode);
        }
      }

      if (validateOnly && isCorrect) {
        resetFailedAttempts();
        return true;
      }

      if (
        !validateOnly &&
        obscureCodeEnabled &&
        passcodeValue === DEFAULT_OBSCURE_CODE
      ) {
        setAuthState('obscured');
        resetFailedAttempts();
        return true;
      }

      if (isCorrect && !validateOnly) {
        setAuthState('authenticated');
        resetFailedAttempts();
        return true;
      }

      const attempts = incrementAndGetAttempts();
      const minutes = getLockoutThreshold(attempts);
      if (minutes) {
        setLockout(Date.now() + minutes * 60 * 1000);
      }

      if (validateOnly) {
        return false;
      }
      throw new Error('Incorrect Passcode');
    },
    [
      passcode,
      obscureCodeEnabled,
      incrementAndGetAttempts,
      resetFailedAttempts,
      updateToHashedPasscode,
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
