import React, {FC} from 'react';
import {TabBarIconProps, TabName} from '../../types';
import {TabBarIcon} from './TabBarIcon';
import {useNavigationStore} from '../../../hooks/useNavigationStore';

export const MapTabBarIcon: FC<TabBarIconProps> = props => {
  const {currentTab} = useNavigationStore();

  return (
    <TabBarIcon
      {...props}
      isFocused={props.focused && currentTab !== TabName.Tracking}
      iconName="map"
    />
  );
};
