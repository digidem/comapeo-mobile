import * as React from 'react';
import {TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {ObservationsList} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';
import {TabBar} from './TabBar';
import {Loading} from '../../sharedComponents/Loading';
import {NEW_DARK_GREY, WHITE} from '../../lib/styles';
import {Drawer} from 'react-native-drawer-layout';
import {DrawerMenu} from '../../sharedComponents/DrawerMenu';
import {useOpenDrawer} from '../../hooks/useOpenDrawer';
import {ProjectRemovalListener} from '../../sharedComponents/ProjectRemovalListener';
import {DownloadIcon} from '../../sharedComponents/icons';
import {useObservations} from '../../hooks/server/observations';
import {useTracks} from '../../hooks/server/track';
import {useAuthContext} from '../../contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

function ObservationsListHeader(
  props: BottomTabHeaderProps & {
    onPress: () => void;
  },
) {
  const navigation = useNavigation();
  const {data: observations} = useObservations();
  const {data: tracks} = useTracks();
  const {authState} = useAuthContext();

  const shouldShowDownloadIcon =
    (observations.length > 0 || tracks.length > 0) && authState !== 'obscured';

  return (
    <HomeHeader
      {...props}
      backgroundColor={WHITE}
      showBottomBorder
      onPress={props.onPress}
      shrinkHeader={shouldShowDownloadIcon}
      downloadIcon={
        shouldShowDownloadIcon ? (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 20,
            }}
            onPress={() => {
              // @ts-expect-error - navigation type mismatch between tab and stack
              navigation.navigate('ExportObservations');
            }}>
            <DownloadIcon size={30} color={NEW_DARK_GREY} />
          </TouchableOpacity>
        ) : undefined
      }
    />
  );
}

export const HomeTabs = () => {
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
              header: props => (
                <React.Suspense fallback={null}>
                  <ObservationsListHeader
                    {...props}
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
