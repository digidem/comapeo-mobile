import {ImageStyle, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Observation, ObservationValue} from '@mapeo/schema';

export type DeviceType = 'mobile' | 'desktop';

export type ViewStyleProp = StyleProp<ViewStyle>;
export type TextStyleProp = StyleProp<TextStyle>;
export type ImageStyleProp = StyleProp<ImageStyle>;

export type IconSize = 'small' | 'medium' | 'large';

export type Status = 'idle' | 'loading' | 'error' | 'success' | void;

export type Position = Observation['metadata']['position'];

export type Provider = Observation['metadata']['positionProvider'];

export type ClientGeneratedObservation = Omit<ObservationValue, 'schemaName'>;

export type Attachment = Observation['attachments'][0];

export type PhotoVariant = 'original' | 'thumbnail' | 'preview';

export type CoordinateFormat = 'utm' | 'dd' | 'dms';

// Copied form /@mapeo/core/src/roles.js. Created an issue to eventuall expose this: https://github.com/digidem/mapeo-core-next/issues/532
export const CREATOR_ROLE_ID = 'a12a6702b93bd7ff';
export const COORDINATOR_ROLE_ID = 'f7c150f5a3a9a855';
export const MEMBER_ROLE_ID = '012fd2d431c0bf60';
export const BLOCKED_ROLE_ID = '9e6d29263cba36c9';
export const LEFT_ROLE_ID = '8ced989b1904606b';
export const NO_ROLE_ID = '08e4251e36f6e7ed';
