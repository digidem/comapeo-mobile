import * as React from 'react';
import {Platform} from 'react-native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {WHITE, DARK_GREY, LIGHT_BLUE, MEDIUM_GREY} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {createOnboardingScreens} from './OnboardingScreens';
import {createAppScreens} from './AppScreens';
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {PendingMapSharesListener} from '../../sharedComponents/PendingMapSharesListener';
import {PendingJoinRequestsListener} from '../../sharedComponents/PendingJoinRequestsListener';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import {AuthScreen} from '../../screens/AuthScreen';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {useIntl} from 'react-intl';
import {RootStack} from './RootStack';
import {InviteSuccessfullyAccepted} from '../../screens/Invites/InviteSuccessfullyAccepted';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {InviteReceived} from '../../screens/Invites/InviteReceived';
import {RequestToJoin} from '../../screens/Invites/RequestToJoin';
import {JoinProject} from '../../screens/Invites/JoinProject';
import {InviteCanceled} from '../../screens/Invites/InviteCanceled';
import {DeepLinkListener} from './DeepLinkListener';
import type {ReceivedInviteLink} from '../../lib/inviteLinks';
import type {ReceivedJoinRequest} from '../../hooks/useInviteLinks';
import {CommonActions, StackActions} from '@react-navigation/native';
import {RUBIK} from '../../lib/fonts';

export type NavigatorLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['layout']
>;
export type NavigatorScreenLayout = NonNullable<
  React.ComponentProps<typeof RootStack.Navigator>['screenLayout']
>;

// The bottom inset sits behind the home indicator (iOS) or, since the nav bar is
// transparent and edge-to-edge, the system navigation bar (Android). It should
// match the screen above it: white like the tabs, except on these screens.
const IOS_BOTTOM_INSET_COLORS: Partial<
  Record<keyof AppStackParamsList, string>
> = {
  IntroToCoMapeo: LIGHT_BLUE,
  AudioRecording: DARK_GREY,
};

function getBottomInsetColor(routeName: keyof AppStackParamsList | undefined) {
  if (Platform.OS === 'android') return MEDIUM_GREY;
  return (routeName && IOS_BOTTOM_INSET_COLORS[routeName]) ?? WHITE;
}

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: RUBIK[500]},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  headerBackVisible: false,
  statusBarStyle: 'dark',
};

type LayoutProps = Parameters<NavigatorLayout>[0];

// Android's bottom inset sits behind the system navigation bar, where grey is a
// deliberate visual choice. iOS's is the home activity indicator, which should
// match the screen above it: white like the tabs, except on these screens.
function openSheetAction(
  {state, descriptors}: Pick<LayoutProps, 'state' | 'descriptors'>,
  name:
    | 'InviteReceived'
    | 'MapReceivedBottomSheet'
    | 'RequestToJoin'
    | 'ReviewJoinRequest',
  params:
    | {inviteId: string}
    | {shareId: string}
    | ReceivedInviteLink
    | ReceivedJoinRequest,
) {
  const currentRoute = state.routes[state.index];
  const presentation = currentRoute
    ? descriptors[currentRoute.key]?.options.presentation
    : undefined;

  return presentation && presentation !== 'card'
    ? StackActions.replace(name, params)
    : CommonActions.navigate(name, params);
}

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

  const layout: NavigatorLayout = ({
    children,
    state,
    navigation,
    descriptors,
  }) => (
    <SafeAreaView
      edges={{bottom: 'maximum'}}
      style={{
        flex: 1,
        paddingBottom: 20,
        backgroundColor: getBottomInsetColor(state.routes[state.index]?.name),
      }}>
      <React.Suspense fallback={<FullScreenCenteredLoader />}>
        <PendingInvitesListener
          currentRouteName={state.routes[state.index]?.name}
          navigateToInviteScreen={inviteId =>
            navigation.dispatch(
              openSheetAction({state, descriptors}, 'InviteReceived', {
                inviteId,
              }),
            )
          }
        />
        <PendingMapSharesListener
          currentRouteName={state.routes[state.index]?.name}
          navigateToMapShareScreen={shareId =>
            navigation.dispatch(
              openSheetAction({state, descriptors}, 'MapReceivedBottomSheet', {
                shareId,
              }),
            )
          }
        />
        <PendingJoinRequestsListener
          currentRouteName={state.routes[state.index]?.name}
          navigateToJoinRequestScreen={request =>
            navigation.dispatch(
              openSheetAction(
                {state, descriptors},
                'ReviewJoinRequest',
                request,
              ),
            )
          }
        />
        {!isNotReadyForInvite && (
          <DeepLinkListener
            currentRouteName={state.routes[state.index]?.name}
            navigateToRequestToJoin={invite =>
              navigation.dispatch(
                openSheetAction({state, descriptors}, 'RequestToJoin', invite),
              )
            }
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
            <RootStack.Screen name="RequestToJoin" component={RequestToJoin} />
            <RootStack.Screen
              name="JoinProject"
              component={JoinProject}
              options={{
                presentation: 'card',
                contentStyle: {backgroundColor: WHITE},
              }}
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
