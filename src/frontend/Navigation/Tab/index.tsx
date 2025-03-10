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
import {DrawerContent} from '../../sharedComponents/DrawerContent';
import {useCloseDrawerOnBackPress} from './useCloseDrawerOnBackPress';
import {StyleSheet, View} from 'react-native';
import {TabBar} from './TabBar';
import {SharedLocationContextProvider} from '../../contexts/SharedLocationContext';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = () => {
  const {formatMessage} = useIntl();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function closeDrawer() {
    setDrawerOpen(false);
  }

  function openDrawer() {
    setDrawerOpen(true);
  }

  useCloseDrawerOnBackPress({drawerOpen, closeDrawer});

  return (
    <>
      {drawerOpen && (
        <View style={styles.backdrop}>
          <DrawerContent closeDrawer={closeDrawer} />
        </View>
      )}
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
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
