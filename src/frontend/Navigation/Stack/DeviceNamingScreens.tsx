import * as React from 'react';
import {RootStack} from '.';
import {IntroToCoMapeo} from '../../screens/IntroToCoMapeo';
import {DataPrivacyScreen} from '../../screens/DataPrivacy';
import {DeviceNaming} from '../../screens/DeviceNaming';
import {Success} from '../../screens/Success';

export const createDeviceNamingScreens = () => (
  <RootStack.Group key="deviceNaming">
    <RootStack.Screen
      name="IntroToCoMapeo"
      component={IntroToCoMapeo}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DataPrivacy"
      component={DataPrivacyScreen}
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
