import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import type {
  ViewStyleProp,
  DeviceConnectionStatus,
  DeviceType,
} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from './Text';
import {MEDIUM_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import Caution from '../images/caution.svg';

const m = defineMessages({
  thisDevice: {
    id: 'sharedComponents.DeviceIconWithName.thisDevice',
    defaultMessage: 'This Device!',
  },
  disconnected: {
    id: 'sharedComponents.DeviceIconWithName.Disconnected',
    defaultMessage: 'Disconnected',
  },
});

type DeviceNameWithIconProps = {
  deviceType: DeviceType;
  name: string;
  deviceId?: string;
  thisDevice?: boolean;
  iconSize?: number;
  style?: ViewStyleProp;
  deviceConnectionStatus?: DeviceConnectionStatus;
};

export const DeviceNameWithIcon = ({
  deviceType,
  name,
  deviceConnectionStatus,
  deviceId,
  thisDevice,
  iconSize,
  style,
}: DeviceNameWithIconProps) => {
  const {formatMessage} = useIntl();

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
    <View style={[styles.flexRow, style]}>
      {deviceType === 'mobile' ? (
        <DeviceMobile width={iconSize || 35} height={iconSize || 35} />
      ) : (
        <DeviceDesktop width={iconSize || 35} height={iconSize || 35} />
      )}
      <View style={{marginLeft: 10, flex: 1}}>
        <Text style={{fontWeight: 'bold'}}>{name}</Text>
        {deviceId && (
          <Text
            style={{color: MEDIUM_GREY, overflow: 'hidden', flexShrink: 1}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${deviceId.slice(0, 12)}...`}
          </Text>
        )}
        {thisDevice && (
          <Text
            style={{flex: 1, color: MEDIUM_GREY, fontSize: 14}}
            numberOfLines={1}>
            {formatMessage(m.thisDevice)}
          </Text>
        )}
        {isDisconnected && (
          <View style={[styles.flexRow, {marginTop: 4.4}]}>
            <Caution />
            <Text style={styles.deviceStatusText}>
              {formatMessage(m.disconnected)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceStatusText: {
    flex: 1,
    fontSize: 12,
    color: MEDIUM_GREY,
    marginLeft: 5,
  },
});
