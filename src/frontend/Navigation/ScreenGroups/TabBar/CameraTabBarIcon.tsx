import React, {FC} from 'react';
import {TabBarIconProps, TabName} from '../../types';
import {TabBarIcon} from './TabBarIcon';

export const CameraTabBarIcon: FC<TabBarIconProps> = props => {
  return (
    <TabBarIcon {...props} tabName={TabName.Camera} iconName="photo-camera" />
  );
};
