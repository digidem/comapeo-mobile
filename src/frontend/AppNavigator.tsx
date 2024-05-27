import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {DrawerNavigator} from './Navigation/Drawer';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {Loading} from './sharedComponents/Loading';

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  if (permissionAsked) {
    SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
      <React.Suspense fallback={<Loading />}>
        <DrawerNavigator />
        <ProjectInviteBottomSheet />
      </React.Suspense>
    </NavigationContainer>
  );
};
