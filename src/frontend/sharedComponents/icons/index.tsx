import React from 'react';
import {TextStyle} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {MEDIUM_GREY} from '../../lib/styles';
import Circle from './Circle';

type FontIconProps = {
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const BackIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="arrow-back" color={color} style={style} size={size} />
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
