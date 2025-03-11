import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {Loading} from './sharedComponents/Loading';
import {AppStackParamsList} from './sharedTypes/navigation';
import {EDITING_SCREEN_NAMES} from './constants';
import {RootStackNavigator} from './Navigation/Stack';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  if (permissionAsked) {
    SplashScreen.hide();
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

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <React.Suspense fallback={<Loading />}>
        <RootStackNavigator navigatorRef={rootNavigationRef} />
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
