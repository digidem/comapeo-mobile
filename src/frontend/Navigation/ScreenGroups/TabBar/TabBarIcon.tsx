import React, {FC} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigationStore} from '../../../hooks/useNavigationStore';
import {TabBarIconProps, TabName} from '../../types';

export interface TabBarIcon extends TabBarIconProps {
  tabName: TabName;
  iconName: string;
}

export const TabBarIcon: FC<TabBarIcon> = ({size, tabName, iconName}) => {
  const {currentTab} = useNavigationStore();

  const color1 = 'rgb(0, 122, 255)';
  const color2 = '#8E8E8F';
  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={currentTab === tabName ? color1 : color2}
    />
  );
};
