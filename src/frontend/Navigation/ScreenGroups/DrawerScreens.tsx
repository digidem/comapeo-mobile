import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {AppNavigator} from '../AppNavigator';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import BootSplash from 'react-native-bootsplash';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {IconButton} from '../../sharedComponents/IconButton';
import {NavigatorScreenParams} from '@react-navigation/native';
import {AppStackList} from '../AppStack';
import {Settings} from '../../screens/Settings';

export type DrawerScreens = {
  DrawerHome: NavigatorScreenParams<AppStackList>;
};

const Drawer = createDrawerNavigator<DrawerScreens>();

export const DrawerNavigator = ({
  permissionAsked,
}: {
  permissionAsked: boolean;
}) => {
  const deviceInfo = useDeviceInfo();

  if (permissionAsked && !deviceInfo.isPending) {
    BootSplash.hide();
  }
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{drawerPosition: 'right', headerShown: false}}
      initialRouteName="DrawerHome">
      <Drawer.Screen options={{}} name="DrawerHome" component={AppNavigator} />
    </Drawer.Navigator>
  );
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <IconButton
        style={{alignSelf: 'flex-end'}}
        onPress={() => props.navigation.closeDrawer()}
        testID="observationListButton">
        <MaterialIcons name="menu" size={32} />
      </IconButton>
      <Settings />
    </DrawerContentScrollView>
  );
};
