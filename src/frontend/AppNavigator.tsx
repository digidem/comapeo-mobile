import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {AppStackParamsList} from './sharedTypes/navigation';
import {useInvitesListeners} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  useInvitesListeners();

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <React.Suspense fallback={null}>
        <RootStackNavigator />
      </React.Suspense>
    </NavigationContainer>
  );
};
