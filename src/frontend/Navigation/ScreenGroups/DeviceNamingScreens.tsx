import * as React from 'react';
import {MessageDescriptor} from 'react-intl';
import {GetStarted} from '../../screens/DeviceNaming/GetStarted';
import {DeviceNaming} from '../../screens/DeviceNaming';
import {Success} from '../../screens/DeviceNaming/Success';
import {RootStack} from '../AppStack';

export type DeviceNamingList = {
  GetStarted: undefined;
  DeviceNaming: undefined;
  Success: {deviceName: string};
};

// **NOTE**: No hooks allowed here (this is not a component, it is a function that returns a react element)
export const createDeviceNamingScreenGroups = (
  intl: (title: MessageDescriptor) => string,
) => (
  <RootStack.Group key="DeviceNaming" screenOptions={{headerShown: false}}>
    <RootStack.Screen name="GetStarted" component={GetStarted} />
    <RootStack.Screen name="DeviceNaming" component={DeviceNaming} />
    <RootStack.Screen name="Success" component={Success} />
  </RootStack.Group>
);
