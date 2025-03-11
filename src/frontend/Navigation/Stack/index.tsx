import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useIntl} from 'react-intl';
import {useSecurityContext} from '../../contexts/SecurityContext';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {Loading} from '../../sharedComponents/Loading';
import {createDefaultScreenGroup} from './AppScreens';
import {createOnboardingScreens} from './OnboardingScreens';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

export const RootStackNavigator = ({
  deviceName,
}: {
  deviceName: string | undefined;
}) => {
  const {formatMessage} = useIntl();
  const security = useSecurityContext();
  const {navigate} = useNavigationFromRoot();

  React.useEffect(() => {
    if (security.authState === 'unauthenticated') {
      navigate('AuthScreen');
    }
  }, [security.authState, navigate]);

  return (
    <RootStack.Navigator
      screenLayout={({children}) => (
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
      )}
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
