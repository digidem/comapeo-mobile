import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useIntl} from 'react-intl';
import {useAuthContext} from '../../contexts/AuthContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {Loading} from '../../sharedComponents/Loading';
import {createDefaultScreenGroup} from './AppScreens';
import {createOnboardingScreens} from './OnboardingScreens';
import {InvitesListener} from '../../sharedComponents/InvitesListener';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

export const RootStackNavigator = ({
  deviceName,
}: {
  deviceName: string | undefined;
}) => {
  const {formatMessage} = useIntl();
  const security = useAuthContext();
  const {navigate} = useNavigationFromRoot();

  React.useEffect(() => {
    if (security.authState === 'unauthenticated') {
      navigate('AuthScreen');
    }
  }, [security.authState, navigate]);

  return (
    <RootStack.Navigator
      layout={({children, state, navigation}) => {
        return (
          <React.Suspense fallback={<Loading />}>
            <InvitesListener
              currentRouteName={state.routes[state.index]?.name}
              navigateToInviteScreen={inviteId =>
                navigation.navigate('InviteReceived', {inviteId})
              }
            />
            {children}
          </React.Suspense>
        );
      }}
      screenLayout={({children}) => {
        return (
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        );
      }}
      screenOptions={NavigatorScreenOptions}>
      {deviceName
        ? createDefaultScreenGroup({
            intl: formatMessage,
          })
        : createOnboardingScreens({intl: formatMessage})}
    </RootStack.Navigator>
  );
};

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};
