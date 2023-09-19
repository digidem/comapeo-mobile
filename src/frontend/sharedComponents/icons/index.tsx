import React from 'react';
import {TextStyle} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {RED} from '../../lib/styles';

type FontIconProps = {
  size?: number;
  color?: string;
  style?: TextStyle;
};

export const BackIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="arrow-back" color={color} style={style} size={size} />
);

export const AlertIcon = ({size = 30, color = RED, style}: FontIconProps) => (
  <MaterialCommunityIcon color={color} name="alert" size={size} style={style} />
);

export const CloseIcon = ({size = 30, color, style}: FontIconProps) => (
  <MaterialIcon name="close" size={size} color={color} style={style} />
);
