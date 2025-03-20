import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';

import {useIsShareDialogOpen} from '../hooks/share';
import {DEFAULT_OBSCURE_CODE} from '../lib/security';
import {useSecurityState} from './SecurityStoreContext';

type AuthState = 'unauthenticated' | 'authenticated' | 'obscured';

type AuthValuesSet = {
  passcodeSet: boolean;
  obscureSet: boolean;
};

type SecurityContextType = {
  authValuesSet: AuthValuesSet;
  authenticate: (
    passcodeValue: string | null,
    validateOnly?: boolean,
  ) => boolean;
  authState: AuthState;
};

const DefaultState: SecurityContextType = {
  authValuesSet: {passcodeSet: false, obscureSet: false},
  authenticate: () => false,
  authState: 'unauthenticated',
};

const SecurityContext = React.createContext<SecurityContextType>(DefaultState);

export const useSecurityContext = () => React.useContext(SecurityContext);

export const SecurityProvider = ({children}: {children: React.ReactNode}) => {
  const {passcode, obscureCodeEnabled} = useSecurityState();
  const [authState, setAuthState] = React.useState<AuthState>(
    passcode === null ? 'authenticated' : 'unauthenticated',
  );

  const shareDialogIsOpen = useIsShareDialogOpen();

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // If the app state changes due to opening a share dialog, do not unauthenticate
        if (shareDialogIsOpen) return;

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
  }, [passcode, shareDialogIsOpen]);

  const authenticate: SecurityContextType['authenticate'] = React.useCallback(
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

  const contextValue: SecurityContextType = React.useMemo(
    () => ({
      authValuesSet: {
        passcodeSet: passcode !== null,
        obscureSet: obscureCodeEnabled,
      },
      authenticate,
      authState,
    }),
    [obscureCodeEnabled, passcode, authenticate, authState],
  );

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
