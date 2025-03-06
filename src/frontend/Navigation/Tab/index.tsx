import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIntl} from 'react-intl';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {
  ObservationsList,
  createNavigationOptions as createObservationsListNavOptions,
} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';
import {useDrawerNavigation} from '../Stack';
import {TabBar} from './TabBar';
import {SharedLocationContextProvider} from '../../contexts/SharedLocationContext';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = () => {
  const {formatMessage} = useIntl();
  const {openDrawer} = useDrawerNavigation();
  return (
    <Tab.Navigator
      tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        headerTransparent: true,
      }}
      initialRouteName={'Map'}
      layout={({children}) => (
        <SharedLocationContextProvider>
          {children}
        </SharedLocationContextProvider>
      )}
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
          header: props => <HomeHeader {...props} openDrawer={openDrawer} />,
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          header: props => <HomeHeader {...props} openDrawer={openDrawer} />,
        }}
      />
    </Tab.Navigator>
  );
};
