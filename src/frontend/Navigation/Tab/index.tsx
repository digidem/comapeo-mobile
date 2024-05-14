import * as React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import {useIntl} from 'react-intl';
import {useCurrentTab} from '../../hooks/useCurrentTab';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {
  ObservationsList,
  createNavigationOptions as createObservationsListNavOptions,
} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {TAB_BAR_HEIGHT} from '../Stack/AppScreens';
import {CameraTabBarIcon} from './TabBar/CameraTabBarIcon';
import {MapTabBarIcon} from './TabBar/MapTabBarIcon';
import {TrackingTabBarIcon} from './TabBar/TrackingTabBarIcon';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = ({openDrawer}: {openDrawer: () => void}) => {
  const {handleTabPress} = useCurrentTab();
  const {formatMessage} = useIntl();
  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: handleTabPress,
      }}
      screenOptions={({route}) => ({
        tabBarStyle: {height: TAB_BAR_HEIGHT},
        tabBarShowLabel: false,
        headerTransparent: true,
        tabBarTestID: 'tabBarButton' + route.name,
      })}
      initialRouteName={'Map'}
      backBehavior="initialRoute">
      <Tab.Screen
        name="ObservationsList"
        component={ObservationsList}
        options={createObservationsListNavOptions(formatMessage)}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: MapTabBarIcon,
          header: props => <HomeHeader {...props} openDrawer={openDrawer} />,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: CameraTabBarIcon,
          header: props => <HomeHeader {...props} openDrawer={openDrawer} />,
        }}
      />

      {process.env.EXPO_PUBLIC_FEATURE_TRACKS && (
        <Tab.Screen
          name="Tracking"
          options={{
            tabBarIcon: TrackingTabBarIcon,
            headerShown: false,
          }}
          listeners={({
            navigation,
          }: {
            navigation: BottomTabNavigationProp<HomeTabsParamsList>;
          }) => ({
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('Map');
            },
          })}
          children={() => <></>}
        />
      )}
    </Tab.Navigator>
  );
};
