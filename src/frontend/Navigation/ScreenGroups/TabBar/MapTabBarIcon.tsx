import React, {FC} from 'react';
import {TabBarIconProps} from '../../types';
import {TabBarIcon} from './TabBarIcon';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';

export const MapTabBarIcon: FC<TabBarIconProps> = props => {
  const {currentTab} = useTabNavigationStore();

  return (
    <TabBarIcon
      {...props}
      focused={props.focused && currentTab !== 'Tracking'}
      iconName="map"
    />
  );
};
