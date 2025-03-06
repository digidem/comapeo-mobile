import * as React from 'react';
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabBarButtonProps,
} from '@react-navigation/bottom-tabs';
import {Pressable, StyleSheet, View} from 'react-native';
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
import {DrawerContent} from '../../sharedComponents/DrawerContent';
import {useCloseDrawerOnBackPress} from './useCloseDrawerOnBackPress';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

const CustomTabBarButton = (props: BottomTabBarButtonProps) => (
  <Pressable
    {...props}
    style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
  />
);

export const HomeTabs = () => {
  const {handleTabPress} = useCurrentTab();
  const {formatMessage} = useIntl();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  function closeDrawer() {
    setDrawerOpen(false);
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
        screenListeners={{
          tabPress: handleTabPress,
        }}
        screenOptions={({route}) => ({
          tabBarStyle: {height: TAB_BAR_HEIGHT},
          tabBarShowLabel: false,
          headerTransparent: true,
          tabBarButton: CustomTabBarButton,
          tabBarButtonTestID: 'tabBarButton' + route.name,
          tabBarAccessibilityLabel: 'Go to ' + route.name,
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
            header: props => (
              <HomeHeader
                {...props}
                openDrawer={() => {
                  console.log('pressed');
                  setDrawerOpen(true);
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            tabBarIcon: CameraTabBarIcon,
            header: props => (
              <HomeHeader {...props} openDrawer={() => setDrawerOpen(true)} />
            ),
          }}
        />
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
