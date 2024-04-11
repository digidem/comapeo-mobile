import * as React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {FC} from 'react';

export interface TabBarIcon {
  size: number;
  focused: boolean;
  color: string;
  isFocused: boolean;
  iconName: string;
}
export const TabBarIcon: FC<TabBarIcon> = ({size, isFocused, iconName}) => {
  const color1 = 'rgb(0, 122, 255)';
  const color2 = '#8E8E8F';
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={isFocused ? color1 : color2}
    />
  );
};
