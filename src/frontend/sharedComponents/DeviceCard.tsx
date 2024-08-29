import React from 'react';
import {StyleSheet} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import type {
  DeviceConnectionStatus,
  DeviceType,
  ViewStyleProp,
} from '../sharedTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';

type DeviceCardProps = {
  deviceType: DeviceType;
  name: string;
  deviceConnectionStatus?: DeviceConnectionStatus;
  thisDevice?: boolean;
  deviceId?: string;
  joinedAt?: string;
  style?: ViewStyleProp;
  onPress?: () => void;
};

export const DeviceCard = ({
  deviceType,
  name,
  style,
  thisDevice,
  deviceId,
  joinedAt,
  onPress,
  deviceConnectionStatus,
}: DeviceCardProps) => {
  let isDisconnected: boolean;
  switch (deviceConnectionStatus) {
    case undefined:
    case 'connected':
      isDisconnected = false;
      break;
    case 'disconnected':
      isDisconnected = true;
      break;
    default:
      throw new ExhaustivenessError(deviceConnectionStatus);
  }

  return (
    <TouchableOpacity
      disabled={!onPress || isDisconnected}
      onPress={() => (onPress ? onPress() : {})}
      style={[styles.container, style]}>
      <DeviceNameWithIcon
        name={name}
        deviceConnectionStatus={deviceConnectionStatus}
        thisDevice={thisDevice}
        deviceType={deviceType}
        deviceId={deviceId}
        joinedAt={joinedAt}
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
