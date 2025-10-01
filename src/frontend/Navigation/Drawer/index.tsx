import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from '../DrawerContent';
import {AppStackNavigator} from '../Stack/AppStackNavigator';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="AppStack"
        component={AppStackNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};
