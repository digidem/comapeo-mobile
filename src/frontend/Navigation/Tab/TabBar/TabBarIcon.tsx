import React, {FC} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TabBarIconProps} from '../../../sharedTypes/navigation';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../../lib/styles';

export interface TabBarIcon extends TabBarIconProps {
  iconName: string;
}

export const TabBarIcon: FC<TabBarIcon> = ({size, iconName, focused}) => {
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={focused ? COMAPEO_BLUE : MEDIUM_GREY}
    />
  );
};
