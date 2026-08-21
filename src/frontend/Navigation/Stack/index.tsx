import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WHITE, MEDIUM_GREY} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {createOnboardingScreens} from './OnboardingScreens';
import {createAppScreens} from './AppScreens';
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {PendingMapSharesListener} from '../../sharedComponents/PendingMapSharesListener';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import {AuthScreen} from '../../screens/AuthScreen';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {useIntl} from 'react-intl';
import {RootStack} from './RootStack';
import {InviteSuccessfullyAccepted} from '../../screens/Invites/InviteSuccessfullyAccepted';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {InviteReceived} from '../../screens/Invites/InviteReceived';
import {InviteCanceled} from '../../screens/Invites/InviteCanceled';
import {DeepLinkListener} from './DeepLinkListener';

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
  return 'Home';
}

export const RootStackNavigator = () => {
  const security = useAuthContext();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const activeProjectId = useActiveProjectId();
  const {formatMessage} = useIntl();
  const isNotReadyForInvite =
    security.authState !== 'authenticated' ||
    !deviceInfo.name ||
    !activeProjectId;

  const layout: NavigatorLayout = ({children, state, navigation}) => (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: MEDIUM_GREY}}>
      <React.Suspense fallback={<FullScreenCenteredLoader />}>
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
        {!isNotReadyForInvite && (
          <DeepLinkListener
            currentRouteName={state.routes[state.index]?.name}
          />
        )}
        {/* Wrap here so app screens get ActiveProjectProvider without a separate navigator.
            activeProjectId is always set before any app screen renders. */}
        {activeProjectId ? (
          <ActiveProjectProvider activeProjectId={activeProjectId}>
            {children}
          </ActiveProjectProvider>
        ) : (
          children
        )}
      </React.Suspense>
    </SafeAreaView>
  );

  const screenLayout: NavigatorScreenLayout = ({children}) => (
    <React.Suspense fallback={<FullScreenCenteredLoader />}>
      {children}
    </React.Suspense>
  );

  const commonNavigatorProps = {
    layout,
    screenLayout,
    screenOptions: NavigatorScreenOptions,
  } as const;

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
        <>
          {!deviceInfo.name || !activeProjectId
            ? createOnboardingScreens({intl: formatMessage})
            : createAppScreens({intl: formatMessage})}
          {/* Shared screen */}
          <RootStack.Group
            navigationKey={activeProjectId}
            screenOptions={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'none',
              contentStyle: {backgroundColor: 'transparent'},
            }}>
            <RootStack.Screen
              name="ErrorBottomSheet"
              component={ErrorBottomSheet}
            />
            <RootStack.Screen
              name="InviteReceived"
              component={InviteReceived}
            />
            <RootStack.Screen
              name="InviteSuccessfullyAccepted"
              component={InviteSuccessfullyAccepted}
            />
            <RootStack.Screen
              name="InviteCanceled"
              component={InviteCanceled}
            />
          </RootStack.Group>
        </>
      )}
    </RootStack.Navigator>
  );
};
