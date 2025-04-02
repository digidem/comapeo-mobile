import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {AppStackParamsList} from './sharedTypes/navigation';
import {RootStackNavigator} from './Navigation/Stack';
import {isEditingScreen} from './lib/isEditingScreen';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const [inviteSheetEnabled, setInviteSheetEnabled] = React.useState(() => {
    return false;
  });

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

  if (permissionAsked) {
    SplashScreen.hide();
  }

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <React.Suspense fallback={null}>
        <RootStackNavigator />
      </React.Suspense>
      <React.Suspense fallback={null}>
        <ProjectInviteBottomSheet
          enabledForCurrentScreen={inviteSheetEnabled}
        />
      </React.Suspense>
    </NavigationContainer>
  );
};
