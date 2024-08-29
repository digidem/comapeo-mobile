import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import type {
  ViewStyleProp,
  DeviceConnectionStatus,
  DeviceType,
} from '../sharedTypes';
import {defineMessages, useIntl, FormattedDate} from 'react-intl';
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
  joinedAt?: string;
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
  joinedAt,
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
      <View style={{paddingLeft: 10}}>
        <View style={styles.nameDateRow}>
          <Text style={styles.nameText}>{name}</Text>
          {joinedAt && (
            <Text style={styles.dateJoinedText}>
              <FormattedDate
                value={new Date(joinedAt)}
                year="numeric"
                month="short"
                day="2-digit"
              />
            </Text>
          )}
        </View>
        {deviceId && (
          <Text style={{color: MEDIUM_GREY}} numberOfLines={1}>
            {`${deviceId.slice(0, 12)}...`}
          </Text>
        )}
        {thisDevice && (
          <Text style={{flex: 1, color: MEDIUM_GREY}}>
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
  nameDateRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameText: {
    fontWeight: 'bold',
    flex: 1,
  },
  dateJoinedText: {
    color: MEDIUM_GREY,
    textAlign: 'right',
    paddingLeft: 10,
  },
  deviceStatusText: {
    flex: 1,
    fontSize: 12,
    color: MEDIUM_GREY,
    marginLeft: 5,
  },
});
