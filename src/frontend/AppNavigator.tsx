import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {Loading} from './sharedComponents/Loading';
import {AppStackParamsList} from './sharedTypes/navigation';
import {createDefaultScreenGroup} from './Navigation/Stack/AppScreens';
import {createOnboardingScreens} from './Navigation/Stack/OnboardingScreens';
import {useClientApi} from '@comapeo/core-react';
import {useQuery} from '@tanstack/react-query';
import {useIntl} from 'react-intl';
import {useSecurityContext} from './contexts/SecurityContext';
import {DEVICE_INFO_KEY} from './hooks/server/deviceInfo';
import {NavigatorScreenOptions, RootStack} from './Navigation/Stack';

export const rootNavigationRef =
  createNavigationContainerRef<AppStackParamsList>();

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const {formatMessage} = useIntl();
  const mapeoApi = useClientApi();

  //This cannot be a suspense query as there is no suspense boundry above this
  const deviceInfo = useQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });

  const security = useSecurityContext();

  if (permissionAsked && !deviceInfo.isPending) {
    SplashScreen.hide();
  }

  React.useEffect(() => {
    if (security.authState === 'unauthenticated') {
      rootNavigationRef.navigate('AuthScreen');
    }
  }, [security.authState]);

  if (deviceInfo.isPending) {
    // should not get here due to splash screen
    return null;
  }

  return (
    <NavigationContainer ref={rootNavigationRef}>
      <RootStack.Navigator
        screenLayout={({children}) => (
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        )}
        screenOptions={NavigatorScreenOptions}>
        {deviceInfo.data?.name
          ? createDefaultScreenGroup({
              intl: formatMessage,
            })
          : createOnboardingScreens({intl: formatMessage})}
      </RootStack.Navigator>
      <React.Suspense fallback={<Loading />}>
        <ProjectInviteBottomSheet rootNavigationRef={rootNavigationRef} />
      </React.Suspense>
    </NavigationContainer>
  );
};
