import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useIntl} from 'react-intl';
import {useAuthContext} from '../../contexts/AuthContext';
import {Loading} from '../../sharedComponents/Loading';
import {createDefaultScreenGroup} from './AppScreens';
import {createOnboardingScreens} from './OnboardingScreens';
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {
  useAppUsageStatsPromptState,
  useAppUsageStatsPromptActions,
} from '../../contexts/AppUsageStatsPromptContext';
import {shouldShowAppUsagePrompt} from '../../lib/shouldShowAppUsagePrompt';
import {createAppUsagePromptScreens} from './UsagePromptScreens';
import {useOwnDeviceInfo, useManyProjects} from '@comapeo/core-react';
import {createProjectOnboardingScreens} from './ProjectOnboardingScreens';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {
  useActiveProjectId,
  useActiveProjectIdActions,
} from '../../contexts/ActiveProjectIdStoreContext';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {AuthScreen} from '../../screens/AuthScreen';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();
export type NavigatorLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['layout']
>;
export type NavigatorScreenLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['screenLayout']
>;

const ErrorBottomSheetOptions: NativeStackNavigationOptions = {
  presentation: 'transparentModal',
  headerShown: false,
  animation: 'none',
  contentStyle: {backgroundColor: 'transparent'},
};

export const RootStackNavigator = () => {
  const {formatMessage} = useIntl();
  const {authState} = useAuthContext();

  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: projects} = useManyProjects();

  const storedActiveProjectId = useActiveProjectId();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const fallbackProjectId = projects?.[0]?.projectId;

  const [hasInitialized, setHasInitialized] = React.useState(false);
  const {recordCompleteOnboarding} = useAppUsageStatsPromptActions();
  const completedOnboardingAt = useAppUsageStatsPromptState(
    state => state.completedOnboardingAt,
  );
  const usagePromptState = useAppUsageStatsPromptState(s => s);
  const showUsagePrompt = shouldShowAppUsagePrompt(usagePromptState);

  React.useEffect(() => {
    // If user already has a device name (i.e., they’ve onboarded in a previous version)
    // but the store has no completion timestamp (new feature), seed it now.
    if (deviceInfo.name && completedOnboardingAt === null) {
      recordCompleteOnboarding();
    }
  }, [deviceInfo?.name, completedOnboardingAt, recordCompleteOnboarding]);

  React.useEffect(() => {
    if (hasInitialized) return;
    if (!storedActiveProjectId && fallbackProjectId) {
      setActiveProjectId(fallbackProjectId);
    }
    setHasInitialized(true);
  }, [
    hasInitialized,
    storedActiveProjectId,
    fallbackProjectId,
    setActiveProjectId,
  ]);

  const layout: NavigatorLayout = ({children, state, navigation}) => (
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

  const screenLayout: NavigatorScreenLayout = ({children}) => (
    <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
  );

  const commonNavigatorProps = {
    layout,
    screenLayout,
    screenOptions: NavigatorScreenOptions,
  } as const;

  if (authState === 'unauthenticated') {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        <RootStack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </RootStack.Navigator>
    );
  }

  if (!hasInitialized) {
    return <Loading />;
  }

  if (!deviceInfo?.name) {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        {createOnboardingScreens({intl: formatMessage})}
      </RootStack.Navigator>
    );
  }

  if (!storedActiveProjectId) {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        {createProjectOnboardingScreens({intl: formatMessage})}
        <RootStack.Screen
          name="ErrorBottomSheet"
          options={ErrorBottomSheetOptions}
          component={ErrorBottomSheet}
        />
      </RootStack.Navigator>
    );
  }

  if (showUsagePrompt) {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        {createAppUsagePromptScreens()}
      </RootStack.Navigator>
    );
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <ActiveProjectProvider activeProjectId={storedActiveProjectId}>
        <RootStack.Navigator {...commonNavigatorProps}>
          {createDefaultScreenGroup({intl: formatMessage})}
          <RootStack.Screen
            name="ErrorBottomSheet"
            component={ErrorBottomSheet}
            options={ErrorBottomSheetOptions}
          />
        </RootStack.Navigator>
      </ActiveProjectProvider>
    </React.Suspense>
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
