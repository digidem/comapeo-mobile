import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack/lib/typescript/src/types';
import {WHITE} from '../lib/styles';
import {AppList} from './ScreenGroups/AppScreens';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft';

export {createDefaultScreenGroup} from './ScreenGroups/AppScreens';

// export type AppStackList = AppList & OnboardingStackList & IccaStackList;
export type AppStackList = AppList;

export const RootStack = createNativeStackNavigator<AppStackList>();

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};
