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
import {useOwnDeviceInfo, useManyProjects} from '@comapeo/core-react';
import {createProjectOnboardingScreens} from './ProjectOnboardingScreens';
import {ActiveProjectProvider} from '../../contexts/ActiveProjectContext';
import {
  useActiveProjectId,
  useActiveProjectIdActions,
} from '../../contexts/ActiveProjectIdStoreContext';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';

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
  const security = useAuthContext();
  const {navigate} = useNavigationFromRoot();

  const {data: deviceInfo} = useOwnDeviceInfo();
  const {data: projects = []} = useManyProjects();

  const storedActiveProjectId = useActiveProjectId();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const fallbackProjectId = projects[0]?.projectId;
  const effectiveProjectId = storedActiveProjectId ?? fallbackProjectId;

  React.useEffect(() => {
    if (!storedActiveProjectId && fallbackProjectId) {
      setActiveProjectId(fallbackProjectId);
    }
  }, [storedActiveProjectId, fallbackProjectId, setActiveProjectId]);

  React.useEffect(() => {
    if (security.authState === 'unauthenticated') {
      navigate('AuthScreen');
    }
  }, [security.authState, navigate]);

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

  if (!deviceInfo?.name) {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        {createOnboardingScreens({intl: formatMessage})}
      </RootStack.Navigator>
    );
  }

  if (projects.length === 0) {
    return (
      <RootStack.Navigator {...commonNavigatorProps}>
        {createProjectOnboardingScreens({intl: formatMessage})}
        <RootStack.Screen
          name="ErrorBottomSheet"
          component={ErrorBottomSheet}
          options={ErrorBottomSheetOptions}
        />
      </RootStack.Navigator>
    );
  }

  if (!effectiveProjectId) {
    return <Loading />;
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <ActiveProjectProvider activeProjectId={effectiveProjectId}>
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
