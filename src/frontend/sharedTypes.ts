// TS port of /src/frontend/types.js
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {MessageDescriptor} from 'react-intl';
import {AppStackList} from './Navigation/AppStack';
import {HomeTabsList} from './Navigation/ScreenGroups/AppScreens';
import {StyleProp, ViewStyle, TextStyle, ImageStyle} from 'react-native';

export type ViewStyleProp = StyleProp<ViewStyle>;
export type TextStyleProp = StyleProp<TextStyle>;
export type ImageStyleProp = StyleProp<ImageStyle>;

export type IconSize = 'small' | 'medium' | 'large';

export type NativeRootNavigationProps<ScreenName extends keyof AppStackList> =
  NativeStackScreenProps<AppStackList, ScreenName>;

export type NativeNavigationScreen<ScreenName extends keyof AppStackList> =
  React.FC<NativeStackScreenProps<AppStackList, ScreenName>> & {
    navTitle: MessageDescriptor;
  };

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

export interface Observation {
  attachments?: {
    id: string;
    type?: string;
  }[];
  tags: {
    [k: string]:
      | boolean
      | number
      | string
      | null
      | (boolean | number | string | null)[];
  };
  created_at: string;
  deviceId?: string;
  id: string;
  lat?: number | null;
  links?: string[];
  lon?: number | null;
  metadata: {
    manualLocation?: boolean;
    position?: Position;
    lastSavedPosition?: Position;
    positionProvider?: {
      gpsAvailable?: boolean;
      passiveAvailable?: boolean;
      locationServicesEnabled?: boolean;
      networkAvailable?: boolean;
    };
  };
  refs?: {
    id: string;
  }[];
  schemaVersion: 5;
  timestamp?: string;
  type: 'observation';
  userId?: string;
  version: string;
}

/**
 * Position details
 */
export interface Position {
  timestamp?: string;
  mocked: boolean;
  coords?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    heading?: number;
    speed?: number;
    accuracy?: number;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export type Provider = Observation['metadata']['positionProvider'];

export interface ClientGeneratedObservation
  extends Omit<
    Observation,
    'created_at' | 'schemaVersion' | 'id' | 'type' | 'version'
  > {}

/**
 * Presets define how map entities are displayed to the user. They define the icon used on the map, and the fields / questions shown to the user when they create or edit the entity on the map. The `tags` property of a preset is used to match the preset with observations, nodes, ways and relations. If multiple presets match, the one that matches the most tags is used.
 */
export interface Preset {
  schemaName: 'preset';
  name: string;
  geometry: ('point' | 'vertex' | 'line' | 'area' | 'relation')[];
  /**
   * The tags are used to match the preset to existing map entities. You can match based on multiple tags E.g. if you have existing points with the tags `nature:tree` and `species:oak` then you can add both these tags here in order to match only oak trees.
   */
  tags: {
    [k: string]:
      | boolean
      | number
      | string
      | null
      | (boolean | number | string | null)[];
  };
  /**
   * Tags that are added when changing to the preset (default is the same value as 'tags')
   */
  addTags: {
    [k: string]:
      | boolean
      | number
      | string
      | null
      | (boolean | number | string | null)[];
  };
  /**
   * Tags that are removed when changing to another preset (default is the same value as 'addTags' which in turn defaults to 'tags')
   */
  removeTags: {
    [k: string]:
      | boolean
      | number
      | string
      | null
      | (boolean | number | string | null)[];
  };
  fieldIds: string[];
  iconId?: string;
  /**
   * Synonyms or related terms (used for search)
   */
  terms: string[];
  id: string;
}
