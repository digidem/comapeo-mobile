import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {MessageDescriptor} from 'react-intl';
import {Observation, ObservationValue} from '@mapeo/schema';
import {AppStackList, HomeTabsList} from './navigation';
export interface TabBarIconProps {
  size: number;
  focused: boolean;
  color: string;
}

export type TabName = keyof HomeTabsList;

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

export type ClientGeneratedObservation = Omit<ObservationValue, 'schemaName'>;

export type Attachment = Observation['attachments'][0];

export type PhotoVariant = 'original' | 'thumbnail' | 'preview';

export type CoordinateFormat = 'utm' | 'dd' | 'dms';
export type DeviceType = 'mobile' | 'desktop';

// Copied form /@mapeo/core/src/roles.js. Created an issue to eventuall expose this: https://github.com/digidem/mapeo-core-next/issues/532
export const CREATOR_ROLE_ID = 'a12a6702b93bd7ff';
export const COORDINATOR_ROLE_ID = 'f7c150f5a3a9a855';
export const MEMBER_ROLE_ID = '012fd2d431c0bf60';
export const BLOCKED_ROLE_ID = '9e6d29263cba36c9';
export const LEFT_ROLE_ID = '8ced989b1904606b';
export const NO_ROLE_ID = '08e4251e36f6e7ed';
