import * as React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {usePersistedPasscode} from '../hooks/persistedState/usePersistedPasscode';

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
  const passcode = usePersistedPasscode(store => store.passcode);
  const obscureCode = usePersistedPasscode(store => store.obscureCode);
  const [authState, setAuthState] = React.useState<AuthState>(
    passcode === null ? 'authenticated' : 'unauthenticated',
  );

  const passcodeSet = passcode !== null;
  const obscureSet = obscureCode !== null;

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (passcodeSet) {
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
  }, [passcodeSet]);

  const authenticate: SecurityContextType['authenticate'] = React.useCallback(
    (passcodeValue, validateOnly = false) => {
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
    },
    [passcode, obscureCode, obscureSet],
  );

  const contextValue: SecurityContextType = React.useMemo(
    () => ({
      authValuesSet: {
        passcodeSet,
        obscureSet,
      },
      authenticate,
      authState,
    }),
    [authenticate, passcodeSet, obscureSet, authState],
  );

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
