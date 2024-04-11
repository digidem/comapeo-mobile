import * as React from 'react';
import {Text} from 'react-native';
import {FC} from 'react';
import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

export interface TabBarLabel {
  isFocused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
}
export const TabBarLabel: FC<TabBarLabel> = ({children, isFocused}) => {
  const color1 = 'rgb(0, 122, 255)';
  const color2 = '#8E8E8F';
  return <Text style={{color: isFocused ? color1 : color2}}>{children}</Text>;
};
