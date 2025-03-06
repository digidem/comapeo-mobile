import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIntl} from 'react-intl';
import {useCurrentTab} from '../../hooks/useCurrentTab';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {
  ObservationsList,
  createNavigationOptions as createObservationsListNavOptions,
} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {CameraTabBarIcon} from './TabBar/CameraTabBarIcon';
import {MapTabBarIcon} from './TabBar/MapTabBarIcon';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';
import {useDrawerNavigation} from '../Stack';
import {TabBar} from './TabBar';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = () => {
  const {handleTabPress} = useCurrentTab();
  const {formatMessage} = useIntl();
  const {openDrawer} = useDrawerNavigation();
  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: handleTabPress,
      }}
      tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        headerTransparent: true,
      }}
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
    </Tab.Navigator>
  );
};
