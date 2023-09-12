import React from 'react';
import {TextStyle} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

type FontIconProps = {
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const BackIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="arrow-back" color={color} style={style} size={size} />
);

export const ErrorIcon = ({
  size = 30,
  color = '#660000',
  style,
}: FontIconProps) => (
  <MaterialIcon
    name="error"
    color={color}
    size={size}
    style={[{position: 'absolute'}, style]}
  />
);
