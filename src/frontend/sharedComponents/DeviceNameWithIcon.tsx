import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import DeviceMobile from '../images/DeviceMobile.svg';
import DeviceDesktop from '../images/DeviceDesktop.svg';
import ShieldIcon from '../images/BlackShield.svg';
import type {
  ViewStyleProp,
  DeviceConnectionStatus,
  DeviceType,
} from '../sharedTypes';
import {defineMessages, useIntl} from 'react-intl';
import {LIGHT_GREY, MEDIUM_GREY} from '../lib/styles';
import {ExhaustivenessError} from '../lib/ExhaustivenessError';
import Caution from '../images/caution.svg';
import {HeaderText} from './Text/HeaderText';
import {BodyText} from './Text/BodyText';

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
      ) : deviceType === 'selfHostedServer' ? (
        <DeviceArchive />
      ) : (
        <DeviceDesktop width={iconSize || 35} height={iconSize || 35} />
      )}
      <View style={{marginLeft: 10, flex: 1}}>
        <HeaderText variant="header6">{name}</HeaderText>
        {deviceId && (
          <BodyText
            style={{color: MEDIUM_GREY, overflow: 'hidden', flexShrink: 1}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {`${deviceId.slice(0, 12)}...`}
          </BodyText>
        )}
        {thisDevice && (
          <BodyText
            variant="smallMeta"
            style={{flex: 1, color: MEDIUM_GREY}}
            numberOfLines={1}>
            {formatMessage(m.thisDevice)}
          </BodyText>
        )}
        {isDisconnected && (
          <View style={[styles.flexRow, {marginTop: 4.4}]}>
            <Caution />
            <BodyText variant="tinyMeta" style={styles.deviceStatusText}>
              {formatMessage(m.disconnected)}
            </BodyText>
          </View>
        )}
      </View>
    </View>
  );
};

const DeviceArchive = () => {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          position: 'relative',
          backgroundColor: LIGHT_GREY,
          borderRadius: 100,
          padding: 40,
          width: 35,
          height: 35,
        },
      ]}>
      <ShieldIcon
        width={50}
        height={50}
        style={{position: 'absolute', top: 15, left: 15}}
      />
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
    color: MEDIUM_GREY,
    marginLeft: 5,
  },
});
