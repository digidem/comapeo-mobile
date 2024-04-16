import {LabelPosition} from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import {HomeTabsList} from './ScreenGroups/AppScreens';

export interface TabBarIconProps {
  size: number;
  focused: boolean;
  color: string;
}

export interface TabBarLabelParams {
  focused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
}

export type TabName = keyof HomeTabsList;
