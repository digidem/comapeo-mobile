import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Image} from 'react-native';

import {Circle} from './Circle';
import {RED, DARK_GREY, MANGO, MEDIUM_GREY, WHITE} from '../../lib/styles';
import type {TextStyleProp, ImageStyleProp} from '../../sharedTypes';

type FontIconProps = {
  size?: number;
  color?: string;
  style?: TextStyleProp;
  testID?: string;
};

type ImageIconProps = {
  size?: number;
  style?: ImageStyleProp;
};

export {GpsIcon} from './GpsIcon';
// export { CategoryIcon, CategoryCircleIcon } from "./CategoryIcon";
export {SyncIconCircle} from './SyncIconCircle';

export const AlertIcon = ({size = 30, color = RED, style}: FontIconProps) => (
  <MaterialCommunityIcon color={color} name="alert" size={size} style={style} />
);

export const SettingsIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon color={color} name="settings" size={size} style={style} />
);

export const CellphoneIcon = ({
  size = 30,
  color = 'white',
  style,
}: FontIconProps) => (
  <MaterialCommunityIcon
    color={color}
    name="cellphone"
    size={size}
    style={style}
  />
);

export const LaptopIcon = ({
  size = 30,
  color = 'white',
  style,
}: FontIconProps) => (
  <MaterialCommunityIcon
    color={color}
    name="laptop"
    size={size}
    style={style}
  />
);

export const BackIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="arrow-back" color={color} style={style} size={size} />
);

export const DeleteIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="delete-forever" color={color} style={style} size={size} />
);

export const ErrorIcon = ({
  size = 30,
  color = '#660000',
  style,
  testID,
}: FontIconProps) => (
  <MaterialIcon
    testID={testID}
    name="error"
    color={color}
    size={size}
    style={[{position: 'absolute'}, style]}
  />
);

export const EditIcon = ({
  size = 30,
  color = DARK_GREY,
  style,
  testID = '',
}: FontIconProps) => (
  <MaterialIcon
    testID={testID}
    color={color}
    style={style}
    name="edit"
    size={size}
  />
);

export const DetailsIcon = ({
  size = 30,
  color = DARK_GREY,
  style,
}: FontIconProps) => (
  <MaterialIcon
    color={color}
    style={style}
    name="format-list-bulleted"
    size={size}
  />
);

export const DoneIcon = ({
  size = 30,
  color = 'white',
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="check" size={size} />
);

export const LocationIcon = ({
  size = 30,
  color = MANGO,
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="my-location" size={size} />
);

export const WifiOffIcon = ({
  size = 30,
  color = '#490827',
  style,
}: FontIconProps) => (
  <MaterialIcon
    color={color}
    style={style}
    name="signal-wifi-off"
    size={size}
  />
);

export const WifiIcon = ({
  size = 30,
  color = 'white',
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="wifi" size={size} />
);
export const SyncIcon = ({size = 20, color = WHITE}: FontIconProps) => (
  <FontAwesomeIcon
    color={color}
    name="bolt"
    size={size}
    style={{transform: [{rotate: '15deg'}]}}
  />
);

export const CloseIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="close" size={size} color={color} style={style} />
);

export const CameraIcon = ({
  size = 30,
  color = MEDIUM_GREY,
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="photo-camera" size={size} />
);

export const UserIcon = ({
  size = 30,
  color = 'lightgray',
  style,
}: FontIconProps) => (
  <FontAwesomeIcon
    color={color}
    name="user-circle-o"
    size={size}
    style={style}
  />
);

export const ObservationListIcon = ({size = 30, style}: ImageIconProps) => (
  <Image
    source={require('../../images/observation-manager-icon.png')}
    style={[{width: size, height: size}, style]}
  />
);

export const LocationNoFollowIcon = ({
  size = 30,
  color = MEDIUM_GREY,
}: FontIconProps) => (
  <Circle radius={25}>
    <MaterialIcon color={color} name="location-searching" size={size} />
  </Circle>
);

export const LocationFollowingIcon = ({
  size = 30,
  color = '#4A90E2',
}: FontIconProps) => (
  <Circle radius={25}>
    <MaterialIcon color={color} name="my-location" size={size} />
  </Circle>
);

export const StopIcon = ({color = WHITE, size = 30}: FontIconProps) => (
  <FontAwesomeIcon color={color} name="stop" size={size} />
);
