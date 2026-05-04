import * as React from 'react';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WHITE, MEDIUM_GREY} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {Loading} from '../../sharedComponents/Loading';
import {createOnboardingScreens} from './OnboardingScreens';
import {createAppScreens} from './AppScreens';
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {PendingMapSharesListener} from '../../sharedComponents/PendingMapSharesListener';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import {AuthScreen} from '../../screens/AuthScreen';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {useIntl} from 'react-intl';
import {useNavigation} from '@react-navigation/native';
import {RootStack} from './RootStack';
import {usePendingDeepLink} from '../../contexts/PendingDeepLinkContext';
import {parseInviteUrl} from '../../lib/deepLinkConfig';

export type NavigatorLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['layout']
>;
export type NavigatorScreenLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['screenLayout']
>;

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  headerBackVisible: false,
  statusBarStyle: 'dark',
};

function getInitialRoute(
  authState: 'authenticated' | 'unauthenticated' | 'obscured',
  deviceName: string | undefined,
  projectId: string | undefined,
): keyof AppStackParamsList {
  if (authState === 'unauthenticated') {
    return 'AuthScreen';
  }
  if (!deviceName) {
    return 'IntroToCoMapeo';
  }
  if (!projectId) {
    return 'Success';
  }
  return 'Success';
}

// Gets and parses any deep link URL that arrived
// while the app was not ready (passcode screen or mid-onboarding),
// then clears the value.
const PendingDeepLinkHandler = () => {
  const {pendingUrl, clearPendingUrl} = usePendingDeepLink();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamsList>>();

  React.useEffect(() => {
    if (!pendingUrl) return;
    const inviteId = parseInviteUrl(pendingUrl);
    if (inviteId) {
      navigation.navigate('InviteReceived', {inviteId});
    }
    clearPendingUrl();
  }, [pendingUrl, clearPendingUrl, navigation]);

  return null;
};

export const RootStackNavigator = () => {
  const security = useAuthContext();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const activeProjectId = useActiveProjectId();
  const {formatMessage} = useIntl();
  const {setNotReadyForInvite} = usePendingDeepLink();

  const isNotReadyForInvite =
    security.authState === 'unauthenticated' ||
    !deviceInfo.name ||
    !activeProjectId;

  // Keep the deep link context in sync so it knows whether to stash
  // incoming URLs or let React Navigation's linking prop handle them.
  React.useEffect(() => {
    setNotReadyForInvite(isNotReadyForInvite);
  }, [isNotReadyForInvite, setNotReadyForInvite]);

  const layout: NavigatorLayout = ({children, state, navigation}) => (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: MEDIUM_GREY}}>
      <React.Suspense fallback={<Loading />}>
        <PendingInvitesListener
          currentRouteName={state.routes[state.index]?.name}
          navigateToInviteScreen={inviteId =>
            navigation.navigate('InviteReceived', {inviteId})
          }
        />
        <PendingMapSharesListener
          currentRouteName={state.routes[state.index]?.name}
          navigateToMapShareScreen={shareId =>
            navigation.navigate('MapReceivedBottomSheet', {shareId})
          }
        />
        {!isNotReadyForInvite && <PendingDeepLinkHandler />}
        {children}
      </React.Suspense>
    </SafeAreaView>
  );

  const screenLayout: NavigatorScreenLayout = ({children}) => (
    <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
  );

  const commonNavigatorProps = {
    layout,
    screenLayout,
    screenOptions: NavigatorScreenOptions,
  } as const;

  if (isNotReadyForInvite) {
    const initialRouteName = getInitialRoute(
      security.authState,
      deviceInfo.name,
      activeProjectId,
    );

    return (
      <RootStack.Navigator
        {...commonNavigatorProps}
        initialRouteName={initialRouteName}>
        {security.authState === 'unauthenticated' ? (
          <RootStack.Screen
            name="AuthScreen"
            component={AuthScreen}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        ) : (
          createOnboardingScreens({intl: formatMessage})
        )}
      </RootStack.Navigator>
    );
  }

  return (
    <ActiveProjectProvider activeProjectId={activeProjectId}>
      <RootStack.Navigator {...commonNavigatorProps}>
        {createAppScreens({intl: formatMessage})}
      </RootStack.Navigator>
    </ActiveProjectProvider>
  );
};
