import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useAuthContext} from '../../contexts/AuthContext';
import {Loading} from '../../sharedComponents/Loading';
import {OnboardingScreens} from './OnboardingScreens';
import {PendingInvitesListener} from '../../sharedComponents/PendingInvitesListener';
import {useOwnDeviceInfo} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import {AuthScreen} from '../../screens/AuthScreen';
import {DrawerNavigator} from '../Drawer';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  headerBackVisible: false,
};

function getOnboardingInitialRoute(
  deviceName: string | undefined,
  projectId: string | undefined,
): keyof AppStackParamsList {
  if (!deviceName) {
    return 'IntroToCoMapeo';
  }
  if (!projectId) {
    return 'Success';
  }
  return 'Success';
}

export const RootStackNavigator = () => {
  const security = useAuthContext();
  const {data: deviceInfo} = useOwnDeviceInfo();
  const activeProjectId = useActiveProjectId();

  if (security.authState === 'unauthenticated') {
    return (
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        <RootStack.Screen name="AuthScreen" component={AuthScreen} />
      </RootStack.Navigator>
    );
  }
  if (!deviceInfo.name || !activeProjectId) {
    const initialRouteName = getOnboardingInitialRoute(
      deviceInfo.name,
      activeProjectId,
    );

    return (
      <RootStack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={NavigatorScreenOptions}
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
        }}>
        {OnboardingScreens()}
      </RootStack.Navigator>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{headerShown: false}}
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
      }}>
      {/* TODO: Add Modal screen here when needed */}
      <RootStack.Screen name="Drawer" component={DrawerNavigator} />
    </RootStack.Navigator>
  );
};
