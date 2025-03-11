import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {Loading} from './sharedComponents/Loading';
import {AppStackParamsList} from './sharedTypes/navigation';
import {useClientApi} from '@comapeo/core-react';
import {useQuery} from '@tanstack/react-query';
import {DEVICE_INFO_KEY} from './hooks/server/deviceInfo';
import {RootStackNavigator} from './Navigation/Stack';
import {EDITING_SCREEN_NAMES} from './constants';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const mapeoApi = useClientApi();
  const [inviteSheetEnabled, setInviteSheetEnabled] = React.useState(() => {
    return false;
  });

  //This cannot be a suspense query as there is no suspense boundry above this
  const deviceInfo = useQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });

  React.useEffect(() => {
    const unsubscribe = rootNavigationRef.addListener('state', () => {
      const currentRoute = rootNavigationRef?.current?.getCurrentRoute();

      if (!currentRoute) return true;

      for (const name of EDITING_SCREEN_NAMES) {
        if (name === currentRoute.name) {
          setInviteSheetEnabled(false);
          return;
        }
      }

      setInviteSheetEnabled(true);
      return;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (permissionAsked && !deviceInfo.isPending) {
    SplashScreen.hide();
  }

  if (deviceInfo.isPending) {
    //user should not see this due to the splash screen
    return null;
  }

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <RootStackNavigator deviceName={deviceInfo.data?.name} />
      <React.Suspense fallback={<Loading />}>
        <ProjectInviteBottomSheet
          enabledForCurrentScreen={inviteSheetEnabled}
        />
      </React.Suspense>
    </NavigationContainer>
  );
};
