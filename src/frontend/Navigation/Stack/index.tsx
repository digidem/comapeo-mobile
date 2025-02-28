import * as React from 'react';
import {useClientApi} from '@comapeo/core-react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useIntl} from 'react-intl';
import {DEVICE_INFO_KEY} from '../../hooks/server/deviceInfo';
import {createDefaultScreenGroup} from './AppScreens';
import {createOnboardingScreens} from './OnboardingScreens';
import {useSuspenseQuery} from '@tanstack/react-query';
import {Loading} from '../../sharedComponents/Loading';
import {useSecurityContext} from '../../contexts/SecurityContext';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

export function RootStackNavigator({
  navigatorRef,
}: {
  navigatorRef: NavigationContainerRefWithCurrent<AppStackParamsList>;
}) {
  return (
    <React.Suspense fallback={<Loading />}>
      <RootStackNavigatorChild navigatorRef={navigatorRef} />
    </React.Suspense>
  );
}

export function RootStackNavigatorChild({
  navigatorRef: {navigate},
}: {
  navigatorRef: NavigationContainerRefWithCurrent<AppStackParamsList>;
}) {
  const {formatMessage} = useIntl();
  const mapeoApi = useClientApi();
  const deviceInfo = useSuspenseQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });

  const security = useSecurityContext();
  React.useEffect(() => {
    if (security.authState === 'unauthenticated') {
      navigate('AuthScreen');
    }
  }, [security.authState, navigate]);

  return (
    <RootStack.Navigator screenOptions={NavigatorScreenOptions}>
      {deviceInfo.data?.name
        ? createDefaultScreenGroup({
            intl: formatMessage,
          })
        : createOnboardingScreens({intl: formatMessage})}
    </RootStack.Navigator>
  );
}

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};
