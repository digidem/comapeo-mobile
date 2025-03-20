import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {AppStackParamsList} from './sharedTypes/navigation';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {RootStackNavigator} from './Navigation/Stack';
import {isEditingScreen} from './lib/isEditingScreen';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const [inviteSheetEnabled, setInviteSheetEnabled] = React.useState(() => {
    return false;
  });

  //This cannot be a suspense query as there is no suspense boundry above this
  const {data: deviceInfo, isRefetching} = useOwnDeviceInfo();

  React.useEffect(() => {
    const unsubscribe = rootNavigationRef.addListener('state', () => {
      const currentRoute = rootNavigationRef?.current?.getCurrentRoute();

      if (!currentRoute || isEditingScreen(currentRoute.name)) {
        setInviteSheetEnabled(false);
        return;
      }

      setInviteSheetEnabled(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (permissionAsked && !isRefetching) {
    SplashScreen.hide();
  }

  if (isRefetching) {
    //user should not see this due to the splash screen
    return null;
  }

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <RootStackNavigator deviceName={deviceInfo.name} />
      <React.Suspense fallback={null}>
        <ProjectInviteBottomSheet
          enabledForCurrentScreen={inviteSheetEnabled}
        />
      </React.Suspense>
    </NavigationContainer>
  );
};
