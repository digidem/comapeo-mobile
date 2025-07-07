import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {useSetUpInvitesListeners} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  useSetUpInvitesListeners();

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer>
      <React.Suspense fallback={null}>
        <RootStackNavigator />
      </React.Suspense>
    </NavigationContainer>
  );
};
