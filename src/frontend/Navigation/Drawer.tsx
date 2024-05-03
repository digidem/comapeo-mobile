import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {RootStackNavigator} from './Stack';

type DrawerScreens = {
  DrawerHome: undefined;
};

export const Drawer = createDrawerNavigator<DrawerScreens>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="DrawerHome" component={RootStackNavigator} />
    </Drawer.Navigator>
  );
};
