import * as React from 'react';
import {AppState, AppStateStatus, NativeModules} from 'react-native';
const {FlagSecureModule} = NativeModules;

import {DEFAULT_OBSCURE_CODE, verifyPasscode} from '../lib/security';
import {useSecurityState, useSecurityActions} from './SecurityStoreContext';
import {getLockoutThreshold} from '../lib/security';
import {useShallow} from 'zustand/react/shallow';
import {useQueryClient} from '@tanstack/react-query';

export type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

type AuthContextType = {
  authenticate: (passcodeValue: string) => Promise<boolean>;
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
  const {passcode, obscureCodeEnabled, lockUntil} = useSecurityState(
    useShallow(state => ({
      passcode: state.passcode,
      obscureCodeEnabled: state.obscureCodeEnabled,
      lockUntil: state.lockUntil,
    })),
  );
  const {incrementAndGetAttempts, resetFailedAttempts, setLockUntil} =
    useSecurityActions();
  const [authState, setAuthState] = React.useState<AuthState>(
    passcode === null ? 'authenticated' : 'unauthenticated',
  );
  // If E2E test mode is enabled, disable FlagSecure to allow screen recordings on BrowserStack
  const isE2E = process.env.EXPO_PUBLIC_E2E_TEST === 'true';
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // FlagSecure is an Android-only native module (screen-capture blocking);
    // it's absent on iOS, so guard every call.
    if (passcode !== null && !isE2E) {
      FlagSecureModule?.activate();
    } else {
      FlagSecureModule?.deactivate();
    }
  }, [passcode, isE2E]);

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (passcode !== null) {
          if (nextAppState === 'background' || nextAppState === 'inactive') {
            // Check if any system dialogs are open (file picker, share, permissions)
            // Finds the 'background' key prefix in mutations for the above
            const backgroundMutations = queryClient.getMutationCache().findAll({
              mutationKey: ['background'],
              status: 'pending',
            });

            if (backgroundMutations.length > 0) return;

            setAuthState('unauthenticated');
          }
        }
      },
    );

    return () => appStateListener.remove();
  }, [passcode, queryClient]);

  const authenticate: AuthContextType['authenticate'] = React.useCallback(
    async passcodeValue => {
      const isLockedOut = Date.now() < lockUntil;
      if (isLockedOut) {
        throw new Error('LOCKED_OUT');
      }

      const isCorrect = passcode
        ? await verifyPasscode({input: passcodeValue, stored: passcode})
        : false;

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
      const minutes = getLockoutThreshold(attempts);
      if (minutes) {
        setLockUntil(Date.now() + minutes * 60 * 1000);
      }

      throw new Error('Incorrect Passcode');
    },
    [
      passcode,
      obscureCodeEnabled,
      incrementAndGetAttempts,
      resetFailedAttempts,
      setLockUntil,
      lockUntil,
      setAuthState,
    ],
  );

  const contextValue: AuthContextType = React.useMemo(
    () => ({authenticate, authState}),
    [authenticate, authState],
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
