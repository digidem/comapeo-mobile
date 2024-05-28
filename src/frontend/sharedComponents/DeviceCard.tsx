import React from 'react';
import {StyleSheet} from 'react-native';
import {LIGHT_GREY} from '../lib/styles';
import {DeviceType, ViewStyleProp} from '../sharedTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';

type DeviceCardProps = {
  deviceType: DeviceType;
  name: string;
  isConnected?: boolean;
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
  isConnected = true,
}: DeviceCardProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress || !isConnected}
      onPress={() => (onPress ? onPress() : {})}
      style={[styles.container, style]}>
      <DeviceNameWithIcon
        name={name}
        isConnected={isConnected}
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
