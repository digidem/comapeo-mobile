import React, {FC} from 'react';
import {Text} from 'react-native';
import {useNavigationStore} from '../../../hooks/useNavigationStore';
import {TabBarLabelParams} from '../../types';

export interface TabBarLabel extends TabBarLabelParams {
  tabName: string;
}

export const TabBarLabel: FC<TabBarLabel> = ({children, tabName}) => {
  const {currentTab} = useNavigationStore();

  const color1 = 'rgb(0, 122, 255)';
  const color2 = '#8E8E8F';
  return (
    <Text style={{color: currentTab === tabName ? color1 : color2}}>
      {children}
    </Text>
  );
};
