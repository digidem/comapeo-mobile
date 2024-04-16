import {HomeTabsList} from './ScreenGroups/AppScreens';

export interface TabBarIconProps {
  size: number;
  focused: boolean;
  color: string;
}

export type TabName = keyof HomeTabsList;
