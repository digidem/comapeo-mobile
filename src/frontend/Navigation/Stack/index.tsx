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
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {
  useAppUsageStatsPromptState,
  useAppUsageStatsPromptActions,
} from '../../contexts/AppUsageStatsPromptContext';
import {shouldShowAppUsagePrompt} from '../../lib/shouldShowAppUsagePrompt';
import {createAppUsagePromptScreens} from './UsagePromptScreens';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

export const RootStackNavigator = () => {
  const {formatMessage} = useIntl();
  const security = useAuthContext();
  const {navigate} = useNavigationFromRoot();
  const {recordCompleteOnboarding} = useAppUsageStatsPromptActions();
  const completedOnboardingAt = useAppUsageStatsPromptState(
    state => state.completedOnboardingAt,
  );
  const usagePromptState = useAppUsageStatsPromptState(s => s);
  const showUsagePrompt = shouldShowAppUsagePrompt(usagePromptState);

  const {data: deviceInfo} = useOwnDeviceInfo();

  React.useEffect(() => {
    // If user already has a device name (i.e., they’ve onboarded in a previous version)
    // but the store has no completion timestamp (new feature), seed it now.
    if (deviceInfo.name && completedOnboardingAt === null) {
      recordCompleteOnboarding();
    }
  }, [deviceInfo?.name, completedOnboardingAt, recordCompleteOnboarding]);

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
            <PendingInvitesListener
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
      {deviceInfo.name
        ? showUsagePrompt
          ? createAppUsagePromptScreens()
          : createDefaultScreenGroup({intl: formatMessage})
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
