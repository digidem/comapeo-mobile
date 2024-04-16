import React, {FC} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigationStore} from '../../../hooks/useNavigationStore';
import {TabBarIconProps, TabName} from '../../types';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../../lib/styles';

export interface TabBarIcon extends TabBarIconProps {
  tabName: TabName;
  iconName: string;
}

export const TabBarIcon: FC<TabBarIcon> = ({size, tabName, iconName}) => {
  const {currentTab} = useNavigationStore();

  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={currentTab === tabName ? COMAPEO_BLUE : MEDIUM_GREY}
    />
  );
};
