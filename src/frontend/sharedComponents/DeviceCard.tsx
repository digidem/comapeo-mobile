import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {LIGHT_GREY, MEDIUM_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import type {
  DeviceConnectionStatus,
  DeviceType,
  ViewStyleProp,
} from '../sharedTypes';
import {DeviceNameWithIcon} from './DeviceNameWithIcon';
import {FormattedDate} from 'react-intl';
import {BodyText} from './Text/BodyText';

type DeviceCardProps = {
  deviceType: DeviceType | undefined;
  name: string;
  deviceConnectionStatus?: DeviceConnectionStatus;
  thisDevice?: boolean;
  deviceId?: string;
  dateAdded?: string;
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
      style={style}>
      <View style={styles.container}>
        <DeviceNameWithIcon
          style={{flexShrink: 1}}
          name={name}
          deviceConnectionStatus={deviceConnectionStatus}
          thisDevice={thisDevice}
          deviceType={deviceType}
          deviceId={deviceId}
          iconSize={75}
        />
        <View style={{alignSelf: 'flex-start'}}>
          {dateAdded && (
            <BodyText
              variant="tinyMeta"
              style={{marginBottom: 10, color: MEDIUM_GREY}}>
              <FormattedDate
                value={dateAdded}
                year="numeric"
                month="short"
                day="2-digit"
              />
            </BodyText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
    justifyContent: 'space-between',
  },
});
