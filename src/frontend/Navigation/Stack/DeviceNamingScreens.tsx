import * as React from 'react';
import {RootStack} from '.';
import {IntroToCoMapeo} from '../../screens/Onboarding/IntroToCoMapeo';
import {DataPrivacy} from '../../screens/Onboarding/DataPrivacy';
import {PrivacyPolicy} from '../../screens/PrivacyPolicy';
import {DeviceNaming} from '../../screens/Onboarding/DeviceNaming';
import {Success} from '../../screens/Onboarding/Success';
import {MessageDescriptor} from 'react-intl';

export const createDeviceNamingScreens = ({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) => (
  <RootStack.Group key="deviceNaming">
    <RootStack.Screen
      name="IntroToCoMapeo"
      component={IntroToCoMapeo}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="DataPrivacy"
      component={DataPrivacy}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="PrivacyPolicy"
      component={PrivacyPolicy}
      options={{headerTitle: intl(PrivacyPolicy.navTitle)}}
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
