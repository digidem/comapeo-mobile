import * as React from 'react';
import {RootStack} from '.';
import {AppUsagePromptInterstitial} from '../../screens/AppUsagePromptInterstitial';
import {AppUsageSharingSuccess} from '../../screens/AppUsageSharingSuccess';

export const createAppUsagePromptScreens = () => (
  <RootStack.Group key="appUsagePrompt">
    <RootStack.Screen
      name="AppUsagePromptInterstitial"
      component={AppUsagePromptInterstitial}
      options={{headerShown: false}}
    />
    <RootStack.Screen
      name="AppUsageSharingSuccess"
      component={AppUsageSharingSuccess}
      options={{headerShown: false}}
    />
  </RootStack.Group>
);
