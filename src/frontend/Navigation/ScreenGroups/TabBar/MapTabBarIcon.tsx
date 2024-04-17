import React, {FC} from 'react';
import {TabBarIconProps, TabName} from '../../types';
import {TabBarIcon} from './TabBarIcon';

export const MapTabBarIcon: FC<TabBarIconProps> = props => {
  return <TabBarIcon {...props} tabName={TabName.Map} iconName="map" />;
};
