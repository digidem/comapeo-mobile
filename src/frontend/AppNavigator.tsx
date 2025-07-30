import {
  NavigationContainer,
  type NavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {type AppStackParamsList} from './sharedTypes/navigation';

import {useSetUpInvitesListeners} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';

export const AppNavigator = ({
  permissionAsked,
  navigationIntegration,
}: {
  permissionAsked: boolean;
  navigationIntegration:
    | ReturnType<(typeof Sentry)['reactNavigationIntegration']>
    | undefined;
}) => {
  const containerRef =
    React.useRef<NavigationContainerRef<AppStackParamsList>>(null);
  useSetUpInvitesListeners();

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer
      ref={containerRef}
      onReady={() => {
        navigationIntegration?.registerNavigationContainer(containerRef);
      }}>
      <React.Suspense fallback={null}>
        <RootStackNavigator />
      </React.Suspense>
    </NavigationContainer>
  );
};
