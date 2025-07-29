import * as React from 'react';
import {RootStack} from '.';
import {AppUsagePromptInterstitial} from '../../screens/AppUsagePromptInterstitial';
// import {AppUsageSuccess} from '../../screens/AppUsageSuccess';

export const createAppUsagePromptScreens = () => (
  <RootStack.Group key="appUsagePrompt">
    <RootStack.Screen
      name="AppUsagePromptInterstitial"
      component={AppUsagePromptInterstitial}
      options={{headerShown: false}}
    />
    {/* <RootStack.Screen
      name="AppUsageSuccess"
      component={AppUsageSuccess}
      options={{headerShown: false}}
    /> */}
  </RootStack.Group>
);
