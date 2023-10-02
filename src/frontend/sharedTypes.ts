// TS port of /src/frontend/types.js
import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {MessageDescriptor} from 'react-intl';
import {AppStackList} from './Navigation/AppStack';
import {HomeTabsList} from './Navigation/ScreenGroups/AppScreens';
import {Observation, ObservationValue} from '@mapeo/schema';

export type ViewStyleProp = StyleProp<ViewStyle>;
export type TextStyleProp = StyleProp<TextStyle>;
export type ImageStyleProp = StyleProp<ImageStyle>;

export type IconSize = 'small' | 'medium' | 'large';

export type NativeRootNavigationProps<ScreenName extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, ScreenName>;

export type NativeNavigationComponent<ScreenName extends keyof AppStackList> =
  React.FC<NativeRootNavigationProps<ScreenName>> & {
    navTitle: MessageDescriptor;
  };

export type NativeNavigationScreenWithProps<
  ScreenName extends keyof AppStackList,
  T,
> = React.FC<NativeStackScreenProps<AppStackList, ScreenName> & T> & {
  navTitle: MessageDescriptor;
};

export type NativeHomeTabsNavigationProps<
  ScreenName extends keyof HomeTabsList,
> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsList, ScreenName>,
  NativeStackScreenProps<AppStackList>
>;

export type Status = 'idle' | 'loading' | 'error' | 'success' | void;

export type Position = Observation['metadata']['position'];

export type Provider = Observation['metadata']['positionProvider'];

export type ClientGeneratedObservation = Omit<
  ObservationValue,
  'schemaName' | 'attachments'
>;
