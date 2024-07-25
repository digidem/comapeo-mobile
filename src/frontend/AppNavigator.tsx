import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {DrawerNavigator} from './Navigation/Drawer';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {Loading} from './sharedComponents/Loading';
import {AppStackParamsList} from './sharedTypes/navigation';
import {EDITING_SCREEN_NAMES} from './constants';
import {useReactNavigationDevTools} from '@dev-plugins/react-navigation';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  if (permissionAsked) {
    SplashScreen.hideAsync();
  }

  const [inviteSheetEnabled, setInviteSheetEnabled] = React.useState(() => {
    return shouldEnableInviteSheet();
  });

  React.useEffect(() => {
    const unsubscribe = rootNavigationRef.addListener('state', () => {
      setInviteSheetEnabled(shouldEnableInviteSheet());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useReactNavigationDevTools(rootNavigationRef);

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <React.Suspense fallback={<Loading />}>
        <DrawerNavigator />
        <ProjectInviteBottomSheet
          enabledForCurrentScreen={inviteSheetEnabled}
        />
      </React.Suspense>
    </NavigationContainer>
  );
};

function shouldEnableInviteSheet() {
  const currentRoute = rootNavigationRef?.current?.getCurrentRoute();

  if (!currentRoute) return true;

  for (const name of EDITING_SCREEN_NAMES) {
    if (name === currentRoute.name) return false;
  }

  return true;
}
