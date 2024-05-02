import React, {FC} from 'react';
import {TabBarIconProps} from '../../types.ts';
import {TabBarIcon} from './TabBarIcon.tsx';
import {useTabNavigationStore} from '../../../hooks/useTabNavigationStore.ts';

export const CameraTabBarIcon: FC<TabBarIconProps> = props => {
  const {currentTab} = useTabNavigationStore();

  return (
    <TabBarIcon
      {...props}
      focused={props.focused && currentTab !== 'Tracking'}
      iconName="photo-camera"
    />
  );
};
