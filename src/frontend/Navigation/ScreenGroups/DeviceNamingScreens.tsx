import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {MessageDescriptor} from 'react-intl';
import {GetStarted} from '../../screens/DeviceNaming/GetStarted';
import {DeviceNaming} from '../../screens/DeviceNaming';
import {Success} from '../../screens/DeviceNaming/Success';

export type DeviceNamingList = {
  GetStarted: undefined;
  DeviceNaming: undefined;
  Success: {deviceName: string};
};

const DeviceNamingStack = createNativeStackNavigator<DeviceNamingList>();

// **NOTE**: No hooks allowed here (this is not a component, it is a function that returns a react element)
export const createDeviceNamingScreenGroups = (
  intl: (title: MessageDescriptor) => string,
) => (
  <DeviceNamingStack.Group
    key="DeviceNaming"
    screenOptions={{headerShown: false}}>
    <DeviceNamingStack.Screen name="GetStarted" component={GetStarted} />
    <DeviceNamingStack.Screen name="DeviceNaming" component={DeviceNaming} />
    <DeviceNamingStack.Screen name="Success" component={Success} />
  </DeviceNamingStack.Group>
);
