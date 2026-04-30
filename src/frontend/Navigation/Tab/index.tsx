import * as React from 'react';
import {TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {ObservationsList} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {
  HomeTabsParamsList,
  NativeRootNavigationProps,
} from '../../sharedTypes/navigation';
import {TabBar} from './TabBar';
import {Loading} from '../../sharedComponents/Loading';
import {NEW_DARK_GREY, WHITE} from '../../lib/styles';
import {Drawer} from 'react-native-drawer-layout';
import {DrawerMenu} from '../../screens/DrawerMenu';
import {useOpenDrawer} from '../../hooks/useOpenDrawer';
import {ProjectRemovalListener} from '../../sharedComponents/ProjectRemovalListener';
import {DownloadIcon} from '../../sharedComponents/icons';
import {useObservations} from '../../hooks/server/observations';
import {useTracks} from '../../hooks/server/track';
import {useAuthContext} from '../../contexts/AuthContext';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = ({navigation}: NativeRootNavigationProps<'Home'>) => {
  const [drawerOpen, setDrawerOpen] = useOpenDrawer();

  return (
    <>
      <ProjectRemovalListener />
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
        renderDrawerContent={() => (
          <DrawerMenu
            closeMenu={() => {
              setDrawerOpen(false);
            }}
          />
        )}>
        <Tab.Navigator
          tabBar={props => <TabBar {...props} />}
          screenOptions={{
            tabBarShowLabel: false,
            headerTransparent: true,
            header: props => (
              <React.Suspense fallback={null}>
                <HomeHeader
                  {...props}
                  onPress={() => setDrawerOpen(val => !val)}
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
              headerRight: () => (
                <DownloadObservationsButton
                  onPress={() => navigation.navigate('ExportObservations')}
                />
              ),
              header: props => (
                <React.Suspense fallback={null}>
                  <HomeHeader
                    {...props}
                    backgroundColor={WHITE}
                    showBottomBorder={true}
                    onPress={() => setDrawerOpen(val => !val)}
                  />
                </React.Suspense>
              ),
            }}
          />
          <Tab.Screen name="Map" component={MapScreen} />
          <Tab.Screen name="Camera" component={CameraScreen} />
        </Tab.Navigator>
      </Drawer>
    </>
  );
};

function useShowDownloadIcon() {
  const {data: observations} = useObservations();
  const {data: tracks} = useTracks();
  const {authState} = useAuthContext();

  return (
    (observations.length > 0 || tracks.length > 0) && authState !== 'obscured'
  );
}

function DownloadObservationsButton({onPress}: {onPress: () => void}) {
  const shouldShow = useShowDownloadIcon();

  if (!shouldShow) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        marginRight: 20,
      }}
      accessibilityLabel="Download Observations"
      onPress={onPress}>
      <DownloadIcon size={30} color={NEW_DARK_GREY} />
    </TouchableOpacity>
  );
}
