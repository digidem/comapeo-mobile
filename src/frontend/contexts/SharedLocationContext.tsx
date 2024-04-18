import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {LocationState, useLocation} from '../hooks/useLocation';
import React from 'react';
import {
  getBackgroundPermissionsAsync,
  getForegroundPermissionsAsync,
} from 'expo-location';
import {AppState} from 'react-native';

interface SharedLocationContext {
  location: LocationState;
  bgPermissions: boolean | null;
  fgPermissions: boolean | null;
}

const SharedLocationContext = createContext<SharedLocationContext | null>(null);

const SharedLocationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation({maxDistanceInterval: 3});
  const appState = useRef(AppState.currentState);
  const [bgPermissions, setBgPermissions] = useState<boolean | null>(null);
  const [fgPermissions, setFgPermissions] = useState<boolean | null>(null);

  useEffect(() => {
    const sub = AppState.addEventListener('change', newState => {
      if (
        appState.current.match(/inactive|background/) &&
        newState === 'active'
      ) {
        getBackgroundPermissionsAsync().then(({granted}) =>
          setBgPermissions(granted),
        );
        getForegroundPermissionsAsync().then(({granted}) =>
          setFgPermissions(granted),
        );
      }
      appState.current = newState;
    });

    return () => sub.remove();
  }, []);

  return (
    <SharedLocationContext.Provider
      value={{
        location,
        bgPermissions,
        fgPermissions,
      }}>
      {children}
    </SharedLocationContext.Provider>
  );
};

function useSharedLocationContext() {
  const context = useContext(SharedLocationContext);
  if (!context) {
    throw new Error(
      'useSharedLocationContext must be used within a SharedLocationContextProvider',
    );
  }
  return context.location;
}

export {SharedLocationContextProvider, useSharedLocationContext};
