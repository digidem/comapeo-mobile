import {DeviceType} from 'react-native-device-info';
import {DeviceRoleForNewInvite} from '../sharedTypes';
import {type HomeTabsList} from './Tab';
export interface TabBarIconProps {
  size: number;
  focused: boolean;
  color: string;
}

export type TabName = keyof HomeTabsList;

export type InviteProps = {
  name: string;
  deviceType: DeviceType;
  deviceId: string;
  role: DeviceRoleForNewInvite;
};
