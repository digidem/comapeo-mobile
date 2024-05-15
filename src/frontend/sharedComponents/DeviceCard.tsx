import React from 'react';
import {StyleSheet} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';
import {DeviceType, ViewStyleProp} from '../sharedTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';

export type DeviceStatus = 'connected' | 'disconnected';
type DeviceCardProps = {
  deviceType: DeviceType;
  name: string;
  status: DeviceStatus;
  thisDevice?: boolean;
  deviceId?: string;
  dateAdded?: Date;
  style?: ViewStyleProp;
  onPress?: () => void;
};

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  dateAdded,
  onPress,
  status,
}: DeviceCardProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress || status !== 'connected'}
      onPress={() => (onPress ? onPress() : {})}
      style={[styles.container, style]}>
      <DeviceNameWithIcon
        name={name}
        status={status}
        thisDevice={thisDevice}
        deviceType={deviceType}
        deviceId={deviceId}
        iconSize={75}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
  },
});
