import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {AppStackParamsList} from './sharedTypes/navigation';
import {useSetUpInvitesListeners} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';
import type Sentry from '@sentry/react-native';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({
  permissionAsked,
  navigationIntegration,
}: {
  permissionAsked: boolean;
  navigationIntegration:
    | ReturnType<(typeof Sentry)['reactNavigationIntegration']>
    | undefined;
}) => {
  useSetUpInvitesListeners();

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer
      ref={rootNavigationRef}
      onReady={() => {
        navigationIntegration?.registerNavigationContainer(rootNavigationRef);
      }}>
      <React.Suspense fallback={null}>
        <RootStackNavigator />
      </React.Suspense>
    </NavigationContainer>
  );
};
