import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {ObservationsList} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';
import {TabBar} from './TabBar';
import {Loading} from '../../sharedComponents/Loading';
import {WHITE} from '../../lib/styles';
import {Drawer} from 'react-native-drawer-layout';
import {DrawerMenu} from '../../sharedComponents/DrawerMenu';
import {useOpenDrawer} from '../../hooks/useOpenDrawer';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = () => {
  const [drawerOpen, setDrawerOpen] = useOpenDrawer();

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
      }}
      onOpen={() => {
        setDrawerOpen(true);
      }}
      drawerType="slide"
      swipeEnabled={false}
      renderDrawerContent={() => <DrawerMenu />}>
      <Tab.Navigator
        tabBar={TabBar}
        screenOptions={{
          tabBarShowLabel: false,
          headerTransparent: true,
          header: props => (
            <React.Suspense fallback={null}>
              <HomeHeader
                {...props}
                toggleDrawer={() => setDrawerOpen(val => !val)}
                backgroundColor="transparent"
                showBottomBorder={false}
              />
            </React.Suspense>
          ),
        }}
        initialRouteName={'Map'}
        screenLayout={({children}) => (
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        )}
        backBehavior="initialRoute">
        <Tab.Screen
          name="ObservationsList"
          component={ObservationsList}
          options={{
            headerTransparent: false,
            header: props => (
              <React.Suspense fallback={null}>
                <HomeHeader
                  {...props}
                  backgroundColor={WHITE}
                  showBottomBorder
                  toggleDrawer={() => setDrawerOpen(val => !val)}
                />
              </React.Suspense>
            ),
          }}
        />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
      </Tab.Navigator>
    </Drawer>
  );
};
