import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {LocationState, useLocation} from '../hooks/useLocation';
import React from 'react';
import {
  getBackgroundPermissionsAsync,
  getForegroundPermissionsAsync,
} from 'expo-location';
import {AppState} from 'react-native';

interface SharedLocationContext {
  locationState: LocationState;
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

  const refreshPermissionState = () => {
    getBackgroundPermissionsAsync().then(({granted}) =>
      setBgPermissions(granted),
    );
    getForegroundPermissionsAsync().then(({granted}) =>
      setFgPermissions(granted),
    );
  };

  useEffect(refreshPermissionState, []);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', newState => {
      if (
        appState.current.match(/inactive|background/) &&
        newState === 'active'
      ) {
        refreshPermissionState();
      }
      appState.current = newState;
    });

    return () => subscription.remove();
  }, []);

  return (
    <SharedLocationContext.Provider
      value={{
        locationState: location,
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
  return context;
}

export {SharedLocationContextProvider, useSharedLocationContext};
