import * as React from 'react';
import {MessageDescriptor} from 'react-intl';
import {RootStack} from '../AppStack';
import {IntroToCoMapeo} from '../../screens/IntroToCoMapeo';
import {DeviceNaming} from '../../screens/DeviceNaming';
import {Success} from '../../screens/Success';

export type DeviceNamingSceens = {
  IntroToCoMapeo: undefined;
  DeviceNaming: undefined;
  Success: {deviceName: string};
};

export const createDeviceNamingScreens = (
  intl: (title: MessageDescriptor) => string,
) => (
  <RootStack.Group key="deviceNaming">
    <RootStack.Screen
      name="IntroToCoMapeo"
      component={IntroToCoMapeo}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DeviceNaming"
      component={DeviceNaming}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="Success"
      component={Success}
      options={{headerShown: false}}
    />
  </RootStack.Group>
);
