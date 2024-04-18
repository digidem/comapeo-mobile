import React, {FC} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabBarIconProps} from '../../types';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../../lib/styles';

export interface TabBarIcon extends TabBarIconProps {
  isFocused: boolean;
  iconName: string;
}

export const TabBarIcon: FC<TabBarIcon> = ({size, iconName, isFocused}) => {
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={isFocused ? COMAPEO_BLUE : MEDIUM_GREY}
    />
  );
};
