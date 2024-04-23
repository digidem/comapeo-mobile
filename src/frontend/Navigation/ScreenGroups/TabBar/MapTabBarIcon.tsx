import React, {FC} from 'react';
import {TabBarIconProps, TabName} from '../../types';
import {TabBarIcon} from './TabBarIcon';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';

export const MapTabBarIcon: FC<TabBarIconProps> = props => {
  const {currentTab} = useTabNavigationStore();

  return (
    <TabBarIcon
      {...props}
      isFocused={props.focused && currentTab !== TabName.Tracking}
      iconName="map"
    />
  );
};
