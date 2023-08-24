// TS port of /src/frontend/types.js
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {MessageDescriptor} from 'react-intl';
import {AppStackList} from './Navigation/AppStack';
import {HomeTabsList} from './Navigation/ScreenGroups/AppScreens';

export type NativeRootNavigationProps<ScreenName extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, ScreenName>;

/**
 * Add description here
 */
export type NativeNavigationComponent<ScreenName extends keyof AppStackList> =
  React.FC<NativeRootNavigationProps<ScreenName>> & {
    navTitle: MessageDescriptor;
  };

export type NativeHomeTabsNavigationProps<
  ScreenName extends keyof HomeTabsList,
> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsList, ScreenName>,
  NativeStackScreenProps<AppStackList>
>;
